import express from 'express';
import { createPaymentIntent, retrievePaymentDetails, updatePaymentStatus, createOfferPaymentIntent, totalRevenue, revenueInDateRange, refund } from '../controllers/paymentController.js';

const PaymentRoutes = express.Router();

PaymentRoutes.get('/createPaymentIntent', createPaymentIntent);
PaymentRoutes.get('/createOfferPaymentIntent',createOfferPaymentIntent );
PaymentRoutes.get('/retrievePaymentDetails/:sessionId', retrievePaymentDetails);
PaymentRoutes.get('/updatePaymentStatus/:email', updatePaymentStatus);
PaymentRoutes.get('/totalRevenue', totalRevenue);
PaymentRoutes.get('/salesperDates', revenueInDateRange)
PaymentRoutes.post('/refund', refund)


export default PaymentRoutes;