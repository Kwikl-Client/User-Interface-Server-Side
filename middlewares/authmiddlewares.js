import jwt from 'jsonwebtoken';
import customerModel from '../models/customerModel.js';

export const protect = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if(err)
                    return res.status(401).json({ success: false, message: 'Not authorized, Invalid Token', error: err });
                req.tokenData = decoded;
                req.customer = await customerModel.findById(decoded.id);
                next();
            });
        }
        else {
            return res.status(401).json({ success: false, message: 'Not authorized, No Token Found', data: null });
        }
    }
    catch (error) {
      return res.status(500).json({success: false, message: 'Internal Server Error', data: null });
    }
};