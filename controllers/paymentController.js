import { configDotenv } from "dotenv";
import Stripe from "stripe";
import moment from 'moment';
import customerModel from "../models/customerModel.js";

configDotenv();
export const stripe = Stripe(process.env.STRIPE_SECRET);

export const createPaymentIntent = async (req, res) => {
  const { email, name } = req.query;
  try {
    const today = moment().startOf('day'); 
    const tomorrow = moment(today).add(1, 'days'); 
    const customerCount = await customerModel.countDocuments({
      createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() }
    });
    let currency;
    let unitAmount;
    if (customerCount < 99) {
      unitAmount = 0.5 * 100; 
      const stripeCountry = 'US'; // Replace with the actual Stripe country code from your user's account
      const countryInfo = await stripe.countrySpecs.retrieve(stripeCountry);
      currency = countryInfo.default_currency.toUpperCase()
      } 
      else {
      unitAmount = 1 * 100; 
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: "Book Name",
              description: "Description of the book",
            },
            unit_amount: unitAmount
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://54.90.125.251/success?&email=${email}&name=${name}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://54.90.125.251/`,
      customer_email: email,
    });

    return res.status(200).json({ success: true, message: 'Intent created successfully', data: session });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
  }
}


export const retrievePaymentDetails = async(req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return res.status(200).json({ success: true, message: 'Intent created successfully', data: session});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null});
    }
}

export const updatePaymentStatus = async(req, res) => {
    try {
        const { email } = req.params;
        const customer = await customerModel.findOne({email: email});
        const session = await stripe.checkout.sessions.retrieve(customer.stripeDetails);
        if(session.payment_status=== "paid"){
            customer.isPaid = true;
            await customer.save();
        }
        else
            return res.status(400).json({ success: false, message: 'Payment is not successfull', data: customer});
        return res.status(200).json({ success: true, message: 'Payment status updated successfully', data: customer});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null});
    }
}
export const createOfferPaymentIntent = async (req, res) => {
    const { email, name } = req.query;
    try {
        const today = moment().startOf('day'); // Get the start of the current day
        const tomorrow = moment(today).add(1, 'days'); // Get the start of the next day
        const customerCount = await customerModel.countDocuments({
            createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() }
        });
        if (customerCount >= 100) {
            return res.status(403).json({ success: false, message: 'Customer limit reached for today', data: null });
        }
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Book",
                        },
                        unit_amount: 500 * 100 // Set unit amount to half of the original price
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://54.90.125.251/success?&email=${email}&name=${name}&sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://54.90.125.251/cancel",
            customer_email: email,
        });
        await customerModel.create({ email: email, stripeDetails: session.id });
        return res.status(200).json({ success: true, message: 'Intent created successfully', data: session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
}
export const totalRevenue = async (req, res) => {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 10, // Set an appropriate limit based on your needs
      });
      const totalRevenue = paymentIntents.data.reduce((total, paymentIntent) => {
        if (paymentIntent && paymentIntent.amount_received && paymentIntent.currency === 'inr') {
          total += paymentIntent.amount_received / 100; // Convert amount from cents to dollars
        }
        return total;
      }, 0);
  
      return res.status(200).json({ success: true, message: 'Total revenue made', data:totalRevenue});
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  export const revenueInDateRange = async (req, res) => {
    try {
      const customers = await customerModel.find();
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'Start date and end date are required.' });
      }
  
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 10,
        created: {
          gte: new Date(startDate).getTime() / 1000,
          lte: new Date(endDate).getTime() / 1000,
        },
      });
  
      const filteredCustomers = customers.filter(customer => {
        const customerCreatedDate = formatDateTime(customer.createdAt);
        console.log('Customer Created Date:', customerCreatedDate);
        return (
            paymentIntents.data.some(paymentIntent => paymentIntent.customer === customer.stripeDetails) &&
            new Date(formatDateTime(customerCreatedDate)).getTime() / 1000 >= new Date(startDate).getTime() / 1000 &&
            new Date(formatDateTime(customerCreatedDate)).getTime() / 1000 <= new Date(endDate).getTime() / 1000
          );
          
      });
      const emailList = filteredCustomers.map(customer => customer.email);
  
      const totalRevenue = paymentIntents.data.reduce((total, paymentIntent) => {
        if (paymentIntent && paymentIntent.amount_received && paymentIntent.currency === 'inr') {
          total += paymentIntent.amount_received / 100; // Convert amount from cents to dollars
        }
        return total;
      }, 0);
  
      return res.status(200).json({
        success: true,
        message: 'Revenue and emails within specified date range',
        data: {
          startDate,
          endDate,
          totalRevenue,
          emails: emailList,
        },
      });
    } catch (error) {
      console.error('Error fetching revenue and emails in date range:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  export const refund = async (req, res) => {
    try {
      const { email, percent } = req.body;
      const existingMember = await customerModel.findOne({ email });
  
      if (!existingMember) {
        return res.status(400).json({ success: false, message: 'Customer not found', data: null });
      }
        const createdAtDate = moment(existingMember.createdAt);
      const currentDate = moment();
      const daysDifference = currentDate.diff(createdAtDate, 'days');
  
      if (daysDifference > 7) {
        return res.status(400).json({
          success: false,
          message: 'Refund request cannot be raised for emails created more than 7 days ago',
          data: null,
        });
      }
  
      if (existingMember.refundStatus === 'not raised') {
        existingMember.refundStatus = 'raised';
      } else {
        return res.status(400).json({
          success: false,
          message: 'You have already raised a refund request',
          data: null,
        });
      }
  
      existingMember.refundPercent = percent;
      await existingMember.save();
  
      return res.status(200).json({
        success: true,
        message: 'Refund request raised successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error raising refund request:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };