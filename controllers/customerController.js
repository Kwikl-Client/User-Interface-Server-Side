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

export const bookAppointment = async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch user with matching email and valid customerType
        const existingUser = await customerModel.findOne({
            email: email.trim(),
            customerType: { $in: ["member", "participant", "star"] },
        });

        // If no user found or not a valid customer type
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Customer not found or not eligible",
                data: null,
            });
        }

        const now = new Date();

        // If the user has already raised a request
        if (existingUser.talkToStarStatus === "raised") {
            const raisedAt = existingUser.talkToStarStatusRaisedAt;

            // Ensure raisedAt exists
            if (raisedAt) {
                const diffInMs = now - new Date(raisedAt);
                const daysPassed = diffInMs / (1000 * 60 * 60 * 24);

                // Less than 30 days
                if (daysPassed < 30) {
                    const daysLeft = Math.ceil(30 - daysPassed);
                    return res.status(429).json({
                        success: false,
                        message: `You've already raised a request. Please wait ${daysLeft} more day(s) before you can request again.`,
                        data: null,
                    });
                }
            }

            // 30 or more days passed — allow rebooking
            existingUser.talkToStarStatusRaisedAt = now;
            await existingUser.save();

            return res.status(200).json({
                success: true,
                message: "Appointment rebooked successfully after 30 days.",
                data: existingUser,
            });
        }

        // First-time appointment: deny booking, ask to wait 30 days
        return res.status(200).json({
            success: false,
            message: "Thank You.You raised a request Please wait 30 days",
            data: null,
        });

    } catch (error) {
        console.error("Error in booking appointment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null,
        });
    }
};

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
            await sendMail(
  email,
  "🌟 Welcome, Chosen One — Your STAR Awakening Begins",
  `Welcome, Chosen One.\n\n
You’ve just taken your first step into your STAR Awakening — a journey to awaken the true self that has always been within you, unlocking strength, clarity, and peace.\n
Your Access Details\n\n
• Username: your email\n
• Temporary Password: ${password}\n
👉 Begin here: salssky.com/login\n\n
Inside, you’ll discover your sanctuary for growth and connection — a place to rise with your global tribe, build unstoppable momentum, and let your STAR life unfold.\n
We are honored to walk this journey with you.\n
— The SalsSky Team`
);
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
export const dailyUserCount = async (req, res) => {
    try {
        const todayEST = moment().tz("America/New_York").format("YYYY-MM-DD");
        const userCount = await allUsersModel.countDocuments({
            createdAt: {
                $gte: new Date(todayEST + "T00:00:00.000Z"),
                $lt: new Date(todayEST + "T23:59:59.999Z"),
            },
        });
        const count = 99-userCount;
        return res.status(200).json({
            success: true,
            count, // Just returns the number
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            userCount: null
        });
    }
};
export const allUsersData = async (req, res) => {
    try {
        const { email } = req.body;
        const emailcheck = await customerModel.findOne({ email });
        if(!emailcheck){
            const newCustomer = await allUsersModel.create({ email });
        
            return res.status(201).json({
                success: true,
                message: 'New Customer Account Created Successfully.',
                data: { email: newCustomer.email },
            });
        }
        else{
            return res.status(500).json({ success: false, message: 'Email already exixts. please try with other email', data: null });
  
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
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

export const editCustomerDetails = async (req, res) => {
    try {
        // console.log("Received request to edit customer details");
        let { oldPassword, newPassword, country, phoneNumber } = req.body;
        const customer = req.customer;

        if (!customer) {
            // console.log("Customer not found in request");
            return res.status(400).json({
                success: false,
                message: "Customer not found",
                data: null,
            });
        }

        if (oldPassword && newPassword) {
            console.log("Password change requested");
            const isMatching = await verifyPwd(oldPassword, customer.password);
            // console.log("Password match result:", isMatching);

            if (!isMatching) {
                console.log("Old password does not match");
                return res.status(401).json({
                    success: false,
                    message: "Incorrect old password",
                    data: null,
                });
            }

            const hashedNewPwd = await encrypt(newPassword);
            console.log("New hashed password:", hashedNewPwd);
            console.log("Old hashed password:", customer.password);
            customer.password = hashedNewPwd;

            const { subject, text, html } = emailTemplates.passwordChanged();
            // console.log("Sending password changed email to:", customer.email);

            await sendMail(customer.email, subject, text, html);
        }

        // Logging profile changes
        // console.log("Updating customer profile fields");
        // console.log("Old country:", customer.country, "New country:", country);
        // console.log("Old phoneNumber:", customer.phoneNumber, "New phoneNumber:", phoneNumber);

        customer.country = country || customer.country;
        customer.phoneNumber = phoneNumber || customer.phoneNumber;

        const updatedCustomer = await customer.save();
        // console.log("Customer updated successfully:", updatedCustomer._id);

        const token = oldPassword && newPassword
            ? generateAccessToken(customer._id, customer.email, customer.name)
            : null;

        return res.status(200).json({
            success: true,
            message: "Customer profile edited successfully",
            data: updatedCustomer,
            accessToken: token,
        });
    } catch (error) {
        console.error("Error in editCustomerDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
        });
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
const { email } = req.params;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email parameter is required' });
  }

  try {
    const user = await customerModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.customerType === 'member') {
      return res.status(200).json({ success: true, message: 'User is already a member' });
    }

    if (user.customerType === 'reader') {
      user.customerType = 'member';
      await user.save();
      return res.status(200).json({ success: true, message: 'Customer type updated to member' });
    }

    // Handles other types if needed
    return res.status(400).json({ success: false, message: 'User is not eligible for upgrade' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ success: false, message: 'Server error: unable to update customer type' });
  }
}

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
export const starUserCheck = async (req, res) => {
    const { email, userType } = req.body; // Expecting email and userType in the request body
    try {
        const existingUser = await customerModel.findOne({ email: email }); // Find by email
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'Customer not found', data: null });
        }
        await existingUser.save();
        const userEmail = existingUser.email;
        if (userType === 'host') {
            const generatedCode = generate({
                length: 6, 
                numbers: true, 
                symbols: true, 
                uppercase: true, 
                lowercase: true, 
            });

            await sendMail(userEmail, "Your Host Code", `Your unique access code for host is: ${generatedCode}.`);

            return res.status(200).json({
                success: true,
                message: 'successfully host code sent',
                data: existingUser
            });
        }

        // If not a host, just send a regular email
        await sendMail(userEmail, "Star Member", `Woooo! Your ID has been added to the Host member.`)
        return res.status(200).json({
            success: true,
            message: 'request raised successfully',
            data: existingUser
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
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

  export const updateBankDetails = async (req, res) => {
    try {
        const {
            customId,
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
            branchName,
        } = req.body;

        if (!customId) {
            return res.status(400).json({ message: "customId is required" });
        }

        // Find customer using customId
        const customer = await customerModel.findOne({ customId });

        if (!customer) {
            return res
                .status(404)
                .json({ message: "Admin with this customId not found" });
        }

        // Check if the user is admin
        // if (customer.customerType !== "admin") {
        //     return res
        //         .status(403)
        //         .json({ message: "Only admin can update bank details" });
        // }

        // Validate bank fields
        if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
            return res
                .status(400)
                .json({ message: "All required bank fields must be provided" });
        }

        // Update bank details
        customer.bankDetails = {
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
            branchName,
        };
        await customer.save();

        res.status(200).json({
            success: true,
            message: "Bank details updated successfully",
            bankDetails: customer.bankDetails,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const postWhoAmIContent = async (req, res) => {
try {
    const { name, identity } = req.body;
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing email in query parameter' });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing name data' });
    }

    if (!identity || typeof identity !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing identity data' });
    }

    if (name.length > 150) {
      return res.status(400).json({ error: 'Name exceeds 150 characters' });
    }

    if (identity.length > 150) {
      return res.status(400).json({ error: 'Identity exceeds 150 characters' });
    }

    const customer = await customerModel.findOneAndUpdate(
      { email },
      { whoAmI: { name, identity } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ 
      message: 'WhoAmI updated successfully', 
      whoAmI: customer.whoAmI 
    });
  } catch (error) {
    console.error('Error updating whoAmI:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
export const getWhoAmI = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing email in query parameter' });
    }

    const customer = await customerModel.findOne({ email }, 'whoAmI');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ 
      message: 'WhoAmI retrieved successfully', 
      whoAmI: customer.whoAmI || { name: 'Who Am I?', identity: "What's My Purpose?" }
    });
  } catch (error) {
    console.error('Error fetching whoAmI:', error);
    res.status(500).json({ error: 'Server error' });
  }
};







