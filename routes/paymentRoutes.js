import express from 'express';
import { payment } from '../controllers/buyProduct.js';
import { offerpayment } from '../controllers/offerProduct.js';

const PaymentRoutes = express.Router();


PaymentRoutes.post('/fullpayment', payment);
PaymentRoutes.post('/offerprice',offerpayment)


export default PaymentRoutes;