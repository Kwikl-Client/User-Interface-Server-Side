import jwt from "jsonwebtoken";
import fs from "fs";
import moment from "moment-timezone";
import { stripe } from "./paymentController.js";
import customerModel from "../models/customerModel.js";
import allUsersModel from "../models/allUsersModel.js";
import { encrypt, verifyPwd } from "../utils/hasher.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { generate } from "generate-password";
import sendMail from "../utils/sendMail.js";
import { emailTemplates } from "../utils/emailTemplate.js";
import {
    authenticateGoogle,
    uploadToGoogleDrive,
} from "../utils/uploadToDrive.js";

export const dailyUserCount = async (req, res) => {
    try {
        const todayEST = moment().tz("America/New_York").format("YYYY-MM-DD");
        const userCount = await allUsersModel.countDocuments({
            createdAt: {
                $gte: new Date(todayEST + "T00:00:00.000Z"),
                $lt: new Date(todayEST + "T23:59:59.999Z"),
            },
        });
        const count = 9 - userCount;
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const registerCustomer = async (req, res) => {
    try {
        const { email, stripeDetails } = req.body;
        const existingMember = await customerModel.findOne({ email });
        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: `Customer already exists, please log in.`,
                data: null,
            });
        }

        let allUsers;
        if (!stripeDetails) {
            const user = await allUsersModel.create({ email });
            allUsers = user;
        } else {
            const session = await stripe.checkout.sessions.retrieve(stripeDetails);
            if (!session || session.status !== "complete") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or incomplete Stripe session.",
                    data: null,
                });
            }

            const password = generate({ length: 10, numbers: true });
            const hashedPwd = await encrypt(password);

            const newEntry = {
                email,
                password: hashedPwd,
                stripeDetails: [{
                    sessionId: stripeDetails,
                    timestamp: new Date(),
                    packageType: session.metadata.packageType,
                }],
                amtPaid: session.amount_total,
            };

            const newCustomer = await customerModel.create(newEntry);
            const { subject, text, html } = emailTemplates.welcomeEmail(password);
            await sendMail(email, subject, text, html);

            return res.status(201).json({
                success: true,
                message: "New customer account created successfully. Password has been sent to your email.",
                data: newCustomer,
                accessToken: generateAccessToken(newCustomer._id, email),
            });
        }

        return res.status(201).json({
            success: true,
            message: "User created in allUsersModel. Please provide Stripe details to complete registration.",
            data: allUsers,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const allUsersData = async (req, res) => {
    try {
        const { email } = req.body;
        const emailcheck = await customerModel.findOne({ email });
        if (!emailcheck) {
            const newCustomer = await allUsersModel.create({ email });
            return res.status(201).json({
                success: true,
                message: "New Customer Account Created Successfully.",
                data: { email: newCustomer.email },
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Email already exists. please try with other email",
                data: null,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await customerModel.findOne({ email });
        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Email not found, please signup",
                data: null,
            });
        }

        const isPasswordCrt = await verifyPwd(password, customer.password);
        if (!isPasswordCrt) {
            return res.status(400).json({
                success: false,
                message: "Email found but received wrong password",
                data: null,
            });
        }

        const stripeDetails = customer.stripeDetails;
        let subscriptionStatus = null;
        if (stripeDetails && Array.isArray(stripeDetails) && stripeDetails.length > 0 && stripeDetails[0].sessionId) {
            try {
                const session = await stripe.checkout.sessions.retrieve(stripeDetails[0].sessionId);
                const subscriptionId = session.subscription;
                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    subscriptionStatus = subscription.status;
                }
            } catch (err) {
                console.warn("Stripe fetch failed:", err.message);
            }
        }

        const allowedStatuses = ["active", "trialing"];
        if (subscriptionStatus !== null && !allowedStatuses.includes(subscriptionStatus)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Your subscription status is '${subscriptionStatus}'.`,
                data: null,
            });
        }

        // SET ONLINE ON LOGIN (Socket.io will handle ongoing updates)
        customer.isOnline = true;
        customer.lastActiveAt = new Date();
        await customer.save();

        const isAdmin = customer.isAdmin;

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: customer,
            accessToken: generateAccessToken(customer._id, email, customer.name, isAdmin),
            isAdmin,
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const editCustomerDetails = async (req, res) => {
    try {
        const customer = await customerModel.findById(req.customer._id);
        let passwordUpdated = false;

        const { oldPassword, newPassword } = req.body;
        if (oldPassword && newPassword) {
            const isOldPasswordValid = await verifyPwd(oldPassword, customer.password);
            if (!isOldPasswordValid) {
                return res.status(400).json({ success: false, message: "Old password is incorrect" });
            }
            const hashedNewPassword = await encrypt(newPassword);
            customer.password = hashedNewPassword;
            passwordUpdated = true;
        }

        if (req.body.phoneNumber !== undefined) customer.phoneNumber = req.body.phoneNumber;
        if (req.body.country !== undefined) customer.country = req.body.country;

        await customer.save();

        const isAdmin = customer.isAdmin;
        const newAccessToken = passwordUpdated
            ? generateAccessToken(customer._id, customer.email, customer.name, isAdmin)
            : null;

        res.status(200).json({
            success: true,
            message: "Customer profile edited successfully",
            data: customer,
            accessToken: newAccessToken,
            isAdmin
        });

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyTkn = async (req, res) => {
    try {
        const { token } = req.params;
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                const message = err.name === "TokenExpiredError" ? "Token expired. Please log in again." : "Invalid Token";
                return res.status(401).json({ success: false, message });
            }

            const customer = await customerModel.findById(decoded.id);
            const now = Date.now();
            const isOnline = now - new Date(customer.lastActiveAt).getTime() < 5 * 60 * 1000;

            return res.status(200).json({
                success: true,
                message: "Token verified successfully",
                data: {
                    ...customer.toObject(),
                    isOnline,
                    lastActiveAt: customer.lastActiveAt,
                },
            });
        });
    } catch (error) {
        console.error("Verify token error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await customerModel.findOne({ email });
        return res.json({ exists: !!existingUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const raiseCommunityRequest = async (req, res) => {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, message: 'Email parameter is required' });

    try {
        const user = await customerModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.customerType === 'member') {
            return res.status(200).json({ success: true, message: 'User is already a member' });
        }

        if (user.customerType === 'reader') {
            user.customerType = 'member';
            await user.save();
            return res.status(200).json({ success: true, message: 'Customer type updated to member' });
        }

        return res.status(400).json({ success: false, message: 'User is not eligible for upgrade' });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const starUserCheck = async (req, res) => {
    const { email, userType } = req.body;
    try {
        const existingUser = await customerModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Customer not found" });
        }
        await existingUser.save();
        const userEmail = existingUser.email;

        if (userType === "host") {
            const generatedCode = generate({ length: 6, numbers: true, symbols: true, uppercase: true, lowercase: true });
            await sendMail(userEmail, "Your Host Code", `Your unique access code for host is: ${generatedCode}.`);
            return res.status(200).json({ success: true, message: "successfully host code sent", data: existingUser });
        }

        await sendMail(userEmail, "Star Member", `Woooo! Your ID has been added to the Host member.`);
        return res.status(200).json({ success: true, message: "request raised successfully", data: existingUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const bookAppointment = async (req, res) => {
    const { email } = req.params;
    try {
        const existingUser = await customerModel.findOne({
            email: email.trim(),
            customerType: { $in: ["member", "participant", "star"] },
        });

        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Customer not found or not eligible" });
        }

        const now = new Date();
        if (existingUser.talkToStarStatus === "raised") {
            const raisedAt = existingUser.talkToStarStatusRaisedAt;
            if (raisedAt) {
                const diffInMs = now - new Date(raisedAt);
                const daysPassed = diffInMs / (1000 * 60 * 60 * 24);
                if (daysPassed < 30) {
                    const daysLeft = Math.ceil(30 - daysPassed);
                    return res.status(429).json({
                        success: false,
                        message: `You've already raised a request. Please wait ${daysLeft} more day(s).`,
                    });
                }
            }
            existingUser.talkToStarStatusRaisedAt = now;
            await existingUser.save();
            return res.status(200).json({ success: true, message: "Appointment rebooked successfully after 30 days.", data: existingUser });
        }

        return res.status(200).json({ success: false, message: "Thank You. You raised a request. Please wait 30 days" });

    } catch (error) {
        console.error("Error in booking appointment:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteCustomer = async (req, res) => {
    const { email } = req.params;
    try {
        const customer = await customerModel.findOne({ email });
        if (!customer) return res.status(400).json({ success: false, message: `Customer not found` });
        customer.isDeleted = true;
        await customer.save();
        return res.json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await customerModel.findOne({ email });
        if (!existingUser) return res.status(400).json({ success: false, message: "Email not exist" });
        const password = generate({ length: 10, numbers: true });
        const hashedPwd = await encrypt(password);
        existingUser.password = hashedPwd;
        await existingUser.save();
        const { subject, text, html } = emailTemplates.passwordReset(password);
        await sendMail(email, subject, text, html);
        return res.status(200).json({ success: true, message: `New password has been sent to ${email}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const acceptCookiePolicy = async (req, res) => {
    try {
        const customer = req.customer;
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        customer.policyAccepted = true;
        const acceptedCustomer = await customer.save();
        res.status(200).json({ success: true, message: "Cookie policy accepted", data: acceptedCustomer });
    } catch (error) {
        console.error("Error accepting cookie policy:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateBankDetails = async (req, res) => {
    try {
        const { customId, accountHolderName, bankName, accountNumber, ifscCode, branchName } = req.body;
        if (!customId) return res.status(400).json({ message: "customId is required" });

        const customer = await customerModel.findOne({ customId });
        if (!customer) return res.status(404).json({ message: "Admin with this customId not found" });

        if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
            return res.status(400).json({ message: "All required bank fields must be provided" });
        }

        customer.bankDetails = { accountHolderName, bankName, accountNumber, ifscCode, branchName };
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
        if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Invalid or missing email' });
        if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid or missing name' });
        if (!identity || typeof identity !== 'string') return res.status(400).json({ error: 'Invalid or missing identity' });
        if (name.length > 150) return res.status(400).json({ error: 'Name exceeds 150 characters' });
        if (identity.length > 150) return res.status(400).json({ error: 'Identity exceeds 150 characters' });

        const customer = await customerModel.findOneAndUpdate(
            { email },
            { whoAmI: { name, identity } },
            { new: true, runValidators: true }
        );

        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        res.status(200).json({ message: 'WhoAmI updated successfully', whoAmI: customer.whoAmI });
    } catch (error) {
        console.error('Error updating whoAmI:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getWhoAmI = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Invalid or missing email' });

        const customer = await customerModel.findOne({ email }, 'whoAmI');
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        res.status(200).json({
            message: 'WhoAmI retrieved successfully',
            whoAmI: customer.whoAmI || { name: 'Who Am I?', identity: "What's My Purpose?" }
        });
    } catch (error) {
        console.error('Error fetching whoAmI:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET ALL USERS STATUS (Kept for initial load/fallback)
export const getUsersStatus = async (req, res) => {
    try {
        const users = await customerModel.find({}, 'email isOnline lastActiveAt customId').lean();
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users status:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// LOGOUT — SET OFFLINE (Kept for explicit logout; Socket handles disconnects)
export const logoutCustomer = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await customerModel.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isOnline = false;
    user.lastActiveAt = new Date();
    await user.save();

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
