import jwt from 'jsonwebtoken';
import { stripe } from "./paymentController.js";
import customerModel from "../models/customerModel.js";
import { encrypt, verifyPwd } from "../utils/hasher.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { generate } from "generate-password";
import sendMail from "../utils/sendMail.js";

export const registerCustomer = async (req, res) => {
    try {
        let { name, email, stripeDetails } = req.body;
        const existingMember = await customerModel.findOne({ email: email});
        if (existingMember)
            return res.status(400).json({ success: false, message: `Customer Already Exist, Please Login`, data: null });
        const session = await stripe.checkout.sessions.retrieve(stripeDetails);
        const password = generate({ length: 10, numbers: true  });
        const hashedPwd = await encrypt(password);
        const newEntry = { name, email, password: hashedPwd, stripeDetails, amtPaid: session.amount_total};
        const newCustomer = await customerModel.create(newEntry);
        await sendMail(email, "Wonted Password", `Thank You for purchasing our most rated book. Your password  for one time login is ${password}. We value your journey with us. Have a Good day !!`)

        return res.status(201).json({
            success: true,
            message: 'New Customer Account Created Successfully. Password has been sent to your mail',
            data: newCustomer,
            accessToken: generateAccessToken(newCustomer._id, email, newCustomer.name),
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null});
    }
};

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await customerModel.findOne({email:email});
        if(!customer)
            return res.status(400).json({ success: false, message: 'Email not found please signup',  data: null  });
        const isPasswordCrt = await verifyPwd(password, customer.password);

        if(!isPasswordCrt)
            return res.status(400).json({ success: false, message: 'Email found but recieved wrong password',  data: null  });

        return res.status(200).json({
            success: true,
            message: `LoggedIn Successfully`,
            data: customer,
            accessToken: generateAccessToken(customer._id, email, customer.name),
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const getAllCustomers = async (req, res) => {
    try {
        const { startDate, endDate, searchStr } = req.body;
        let filterPayload = {};
        if (startDate && endDate) {
            const start = new Date(`${startDate}T00:00:00.000Z`);
            const end = new Date(`${endDate}T23:59:59.999Z`);
            filterPayload.createdAt = { $gte: start, $lte: end };
        }
        if (searchStr) {
            filterPayload.email = { $regex: new RegExp(searchStr, 'i') }
        }
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 3; // Default page size to 10 if not provided

        const skip = (page - 1) * pageSize;
        const totalCustomers = await customerModel.countDocuments(filterPayload);
        const totalPages = Math.ceil(totalCustomers / pageSize);
        const customers = await customerModel
            .find(filterPayload)
            .skip(skip)
            .limit(pageSize);

        const totalAmountPipeline = [
            { $match: filterPayload }, // Match your filter conditions
            {
              $group: {
                _id: null,
                totalAmount: { $sum: '$amtPaid' }, // Calculate the sum of the amtPaid field
              },
            },
          ];
          
          const totalAmountResult = await customerModel.aggregate(totalAmountPipeline);
          
          const totalAmount = totalAmountResult[0] ? totalAmountResult[0].totalAmount : 0;


            
        return res.status(200).json({
            success: true,
            message: `All customers listed Successfully in page ${page}`,
            data: {
                totalCustomers: totalCustomers,
                totalAmount,
                customers: customers,
                totalPages: totalPages,
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const getCustomersBetweenDates = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = new Date(`${startDate}T00:00:00.000Z`);
        const end = new Date(`${endDate}T23:59:59.999Z`);
        const customers = await customerModel.find({ createdAt: { $gte: start, $lte: end } });

        return res.status(200).json({
            success: true,
            message: `All customers between ${start} and ${end} are listed Successfully`,
            count: customers.length,
            data: customers
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};
export const editCustomerDetails = async (req, res) => {
    try {
        let {oldPassword, newPassword, country, phoneNumber} = req.body;
        const customer = req.customer;
        if(oldPassword && newPassword){
            var isMatching = await verifyPwd(oldPassword, customer.password);
            if(!isMatching)
                return res.status(401).json({ success: false, message: 'Incorrect old password', data: null });
            const hashedNewPwd = await encrypt(newPassword);
            customer.password = hashedNewPwd;
            await sendMail(customer.email, 'Password Change Notification', 'Your password has been successfully updated.');
        }
        customer.country = country || customer.country;
        customer.phoneNumber = phoneNumber || customer.phoneNumber;
        const updatedCustomer = await customer.save();
        return res.status(200).json({
            success: true,
            message: 'Customer profile edited successfully',
            data: updatedCustomer,
            accessToken: isMatching?generateAccessToken(customer._id, customer.email, customer.name):null,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const verifyTkn = async (req, res) => {
    try {
        const { token } = req.params;
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if(err)
                return res.status(401).json({ success: false, message: 'Not authorized, Invalid Token', error: err });
            const customer = await customerModel.findById(decoded.id);
            return res.status(200).json({
                success: true,
                message: `Token verified successfully Successfully`,
                data: customer
            });
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal Server Error', data: null });
    }
};
export const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const existingCustomer = await customerModel.findOne({email:email});
        if (existingCustomer)
            return res.status(200).json({ success: true, message:"Customer fetched successfully", exists: true, data: existingCustomer });
        return res.status(400).json({ success: false, message:"Customer not found", exists: false, data: null });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Internal Server Error', data: null });
    }
  };

export const raiseCommunityRequest = async (req, res) => {
    const { customId } = req.params;
    try {
        const existingUser = await customerModel.findOne({customId: customId});
        if (!existingUser)
            return res.status(400).json({ success: false, message: 'Customer not found', data: null});
        existingUser.joinCommunityStatus = "raised";
        await existingUser.save();
        return res.status(200).json({
            success: true,
            message: `Join community request raised successfully`,
            data: existingUser
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal Server Error', data: null });
    }
};

export const submitReview = async (req, res) => {
    const { customerId } = req.params;
    const { starRating, reviewText, profession } = req.body;
    try {
      const existingCustomer = await customerModel.findOne({ _id: customerId });
      if (!existingCustomer) {
        return res.status(404).json({ success: false, message: 'Customer not found', data: null });
      }
      existingCustomer.reviews.push({ starRating, reviewText, profession });  
      const updatedCustomer = await existingCustomer.save();
      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: updatedCustomer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
  };
  
export const deleteCustomer = async (req, res) => {
    const { email } = req.params; // Assuming the email is passed as a parameter in the URL
    try {
        const customer = await customerModel.findOne({ email });
        if (!customer)
            return res.status(400).json({ success: false, message: `Customer not found`, data: null });
        customer.isDeleted = true;
        await customer.save();
        return res.json({ success: true, message: 'Customer deleted successfully', data: null });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await customerModel.findOne({email:email});
        if (!existingUser)
            return res.status(400).json({ success: false, message: 'Email not exist', data: null });
        const password = generate({ length: 10, numbers: true  });
        const hashedPwd = await encrypt(password);
        existingUser.password = hashedPwd;
        await existingUser.save();
        await sendMail(email, "Wonted Password", `Your new password is ${password}`)
        return res.status(200).json({
            success: true,
            message: `New password has been sent to ${email}`,
            data: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};