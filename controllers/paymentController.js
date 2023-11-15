import { configDotenv } from "dotenv";
import Stripe from "stripe";
import customerModel from "../models/customerModel.js";

configDotenv();
const stripe = Stripe(process.env.STRIPE_SECRET);

export const createPaymentIntent = async (req, res) => {
    const { email, name }= req.query;
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Book",
                        },
                        unit_amount: 100 * 100
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:3000/success?&email=${email}&name=${name}&sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/cancel",
            customer_email: email,
        })
        await customerModel.findOneAndUpdate({email: email}, {stripeDetails: session.id})
        return res.status(200).json({ success: true, message: 'Intent created successfully', data: session});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null});
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