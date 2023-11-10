import customerModel from "../models/customerModel.js";
import { encrypt, verifyPwd } from "../utils/hasher.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { generate } from "generate-password";
import sendMail from "../utils/sendMail.js";

export const registerCustomer = async (req, res) => {
    try {
        let { name, email } = req.body;
        const existingMember = await customerModel.findOne({ email: email});
        if (existingMember)
            return res.status(400).json({ success: false, message: `Customer Already Exist, Please Login`, data: null });

        const password = generate({ length: 10, numbers: true  });
        await sendMail(email, "Wonted Password", `Your one time password is ${password}`)
        const hashedPwd = await encrypt(password);

        const newEntry = { name, email, password: hashedPwd};
        // create entry in db
        const newCustomer = await customerModel.create(newEntry);
        return res.status(201).json({
            success: true,
            message: 'New Customer Account Created Successfully. Password has been sent to your mail',
            data: newCustomer,
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
            accessToken: generateAccessToken(customer._id, email),
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const getAllCustomers = async (req, res) => {

    try {
        const customers = await customerModel.find();
        return res.status(200).json({
            success: true,
            message: `All customers listed Successfully`,
            data: customers
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};

export const editCustomerPassword = async (req, res) => {

    try {
        let {oldPassword, newPassword} = req.body;
        const customer = req.customer;
        if(await verifyPwd(oldPassword, customer.password)){
            const hashedNewPwd = await encrypt(newPassword);
            customer.password = hashedNewPwd;
            const updatedCustomer = await customer.save();
            return res.status(200).json({ success: true, message: 'User password changed Successfully', data: updatedCustomer});
        }
        else {
            return res.status(401).json({ success: false, message: 'Incorrect old password', data: null });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
    }
};