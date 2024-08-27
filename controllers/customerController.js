import jwt from 'jsonwebtoken';
import fs from 'fs';
import moment from 'moment-timezone';
import { stripe } from "./paymentController.js";
import customerModel from "../models/customerModel.js";
import allUsersModel from "../models/allUsersModel.js"
import { encrypt, verifyPwd } from "../utils/hasher.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { generate } from "generate-password";
import sendMail from "../utils/sendMail.js";
import { authenticateGoogle, uploadToGoogleDrive } from "../utils/uploadToDrive.js";


export const registerCustomer = async (req, res) => {
    try {
        const { email, stripeDetails } = req.body;

        // Check if customer already exists
        const existingMember = await customerModel.findOne({ email: email });
        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: `Customer already exists, please log in.`,
                data: null
            });
        }

        let allUsers;
        if (!stripeDetails) {
            // If stripeDetails are not provided, create a user in allUsersModel
            const user = await allUsersModel.create({ email });
            allUsers = user;
        } else {
            // Retrieve and validate Stripe session
            const session = await stripe.checkout.sessions.retrieve(stripeDetails);

            if (!session || session.status !== 'complete') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or incomplete Stripe session.',
                    data: null
                });
            }

            // Create new customer entry with Stripe details
            const password = generate({ length: 10, numbers: true });
            const hashedPwd = await encrypt(password);

            const newEntry = {
                email,
                password: hashedPwd,
                stripeDetails: [{
                    sessionId: stripeDetails,
                    timestamp: new Date(),
                    packageType: session.metadata.packageType // Capture package type from metadata
                }],
                amtPaid: session.amount_total
            };

            const newCustomer = await customerModel.create(newEntry);

            // Send welcome email
            await sendMail(email, 
                "Welcome aboard; your journey awaits.", 
                `Welcome to your journey of self-transcendence! Your temporary password is ${password}. This is your gateway to the wonders within our dashboard.`);

            return res.status(201).json({
                success: true,
                message: 'New customer account created successfully. Password has been sent to your email.',
                data: newCustomer,
                accessToken: generateAccessToken(newCustomer._id, email),
            });
        }

        return res.status(201).json({
            success: true,
            message: 'User created in allUsersModel. Please provide Stripe details to complete registration.',
            data: allUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};

export const allUsersData = async (req, res) => {
    try {
        const { email } = req.body;
        const existingMember = await allUsersModel.findOne({ email });
        if (existingMember)
            return res.status(400).json({ success: false, message: `Customer Already Exists, Please Login`, data: null });
        const newCustomer = await allUsersModel.create({ email });
        return res.status(201).json({
            success: true,
            message: 'New Customer Account Created Successfully.',
            data: {email: newCustomer.email },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await customerModel.findOne({ email: email });
        if (!customer)
            return res.status(400).json({ success: false, message: 'Email not found, please signup', data: null });

        const isPasswordCrt = await verifyPwd(password, customer.password);
        if (!isPasswordCrt)
            return res.status(400).json({ success: false, message: 'Email found but received wrong password', data: null });

        // Determine if the user is an admin
        const isAdmin = customer.isAdmin;

        return res.status(200).json({
            success: true,
            message: `LoggedIn Successfully`,
            data: customer,
            accessToken: generateAccessToken(customer._id, email, customer.name, isAdmin),
            isAdmin: isAdmin // Return the admin status
        });
    } catch (error) {
        console.log(error);
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
export const customerCount = async (req, res) => {
    try {
        const currentTime = moment().tz('America/New_York');
        const today = moment().startOf('day');
        const tomorrow = moment(today).add(1, 'day');

        const minutesElapsed = currentTime.diff(today, 'minutes');
        const adjustedMinutesElapsed = Math.floor(minutesElapsed / 13); // Adjust for every 20 minutes

        const customerCount = await customerModel.countDocuments({
            createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() }
        });
        let userCount = Math.max(99 - adjustedMinutesElapsed, 0);
        userCount = Math.max(userCount - customerCount, 0);

        res.json({ date: currentTime.toDate(), userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const editCustomerDetails = async (req, res) => {
    try {
        let { oldPassword, newPassword, country, phoneNumber } = req.body;
        const customer = req.customer;
        if (oldPassword && newPassword) {
            var isMatching = await verifyPwd(oldPassword, customer.password);
            if (!isMatching)
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
            accessToken: isMatching ? generateAccessToken(customer._id, customer.email, customer.name) : null,
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
            if (err)
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
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
};
export const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await customerModel.findOne({ email: email });
        if (existingUser) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const raiseCommunityRequest = async (req, res) => {
    const { email } = req.params; // Use email instead of customId
    try {
        const existingUser = await customerModel.findOne({ email: email }); // Find by email
        if (!existingUser)
            return res.status(400).json({ success: false, message: 'Customer not found', data: null });
        
        existingUser.joinCommunityStatus = "raised";
        await existingUser.save();
        
        const userEmail = existingUser.email;
        await sendMail(userEmail, "Join Community Request", `Woooo! Your ID has been added to the Join Community waitlist! Amidst demand, a 40-day journey begins, enriched with an exclusive offer. Let's intertwine destinies and embark on your self-transcendence quest with Salssky Odyssey's essence.`);
        
        return res.status(200).json({
            success: true,
            message: `Join community request raised successfully`,
            data: existingUser
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
};

export const raiseRefundRequest = async (req, res) => {
    const { customId } = req.params;
    try {
        const existingUser = await customerModel.findOne({ customId });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'Customer not found', data: null });
        }
        if (existingUser.refundStatus === 'valid') {
            return res.status(400).json({ success: false, message: 'Refund request  raised', data: existingUser });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (existingUser.createdAt.getTime() > thirtyDaysAgo.getTime()) {
            existingUser.refundStatus = 'valid';
        } else {
            existingUser.refundStatus = 'not valid';
        }

        // Save the updated user document
        await existingUser.save();

        const userEmail = existingUser.email;
        // Assuming `sendMail` function is defined somewhere to send emails
        await sendMail(userEmail, "Refund Request", `Your refund request has been submitted. In the meantime, if you require any assistance, please reach out to our Account Team at support@salssky.com. Make sure the subject line of your email accurately reflects your inquiry.`);

        return res.status(200).json({
            success: true,
            message: 'Refund request successfully initiated.',
            data: existingUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
}
export const checkRefundStatus = async (req, res) => {
    try {
        const { customId } = req.params;
        const existingUser = await customerModel.findOne({ customId: customId });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'Customer not found', data: null });
        }
        if (existingUser.refundStatus === 'valid') {
            return res.status(200).json({ success: true, message: 'Refund request already raised', data: existingUser });
        } else {
            return res.status(200).json({ success: true, message: 'Refund request not yet raised', data: existingUser });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
}

export const checkMessageSent = async (req, res) => {
    const { customId } = req.params;
    try {
        const existingUser = await customerModel.findOne({ customId: customId });
        if (!existingUser)
            return res.status(400).json({ success: false, message: 'Customer not found', data: null });
        if (existingUser.lastHelpMessageSentAt) {
            const timeSinceLastMessage = Date.now() - existingUser.lastHelpMessageSentAt.getTime();
            if (timeSinceLastMessage < (24 * 60 * 60 * 1000)) {
                return res.status(400).json({ success: false, message: 'You can only send one message in every 24 hours', data: null });
            }
        }
        return res.status(200).json({ success: true, message: 'No message sent within last 24 hours', data: null });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
};

export const messageRequest = async (req, res) => {
    const { customId } = req.params;
    const { message } = req.body;

    try {
        const existingUser = await customerModel.findOne({ customId: customId });
        if (!existingUser)
            return res.status(400).json({ success: false, message: 'Customer not found', data: null });

        if (existingUser.lastHelpMessageSentAt) {
            const timeSinceLastMessage = Date.now() - existingUser.lastHelpMessageSentAt.getTime();
            if (timeSinceLastMessage < (24 * 60 * 60 * 1000)) {
                return res.status(400).json({ success: false, message: 'You can only send one message in every 24 hours', data: null });
            }
        }

        existingUser.helpMessage = message;
        existingUser.lastHelpMessageSentAt = new Date(); // Set the timestamp for the last help message sent
        await existingUser.save();
        const userEmail = existingUser.email;
        await sendMail(userEmail, "Message", `We appreciate your time in writing to us. Expect our response shortly.`);

        return res.status(200).json({
            success: true,
            message: `Message sent successfully`,
            data: existingUser
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
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
        const existingUser = await customerModel.findOne({ email: email });
        if (!existingUser)
            return res.status(400).json({ success: false, message: 'Email not exist', data: null });
        const password = generate({ length: 10, numbers: true });
        const hashedPwd = await encrypt(password);
        existingUser.password = hashedPwd;
        await existingUser.save();
        await sendMail(email, "New Password", `Here's the new access key you requested: ${password}`)
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
export const acceptCookiePolicy = async (req, res) => {
    try {
        const customer = req.customer; // Accessing customer from the middleware

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.policyAccepted = true;
        const acceptedCustomer =await customer.save();

        res.status(200).json({success: true, message: 'Cookie policy accepted', data:acceptedCustomer });
    } catch (error) {
        console.error('Error accepting cookie policy:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

  
