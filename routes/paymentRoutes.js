import express from 'express';
import { createPaymentIntent, retrievePaymentDetails, updatePaymentStatus } from '../controllers/paymentController.js';

const PaymentRoutes = express.Router();

PaymentRoutes.get('/createPaymentIntent', createPaymentIntent);
PaymentRoutes.get('/retrievePaymentDetails/:sessionId', retrievePaymentDetails);
PaymentRoutes.get('/updatePaymentStatus/:email', updatePaymentStatus);

export default PaymentRoutes;