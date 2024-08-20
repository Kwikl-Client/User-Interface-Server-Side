import express from 'express';
import { createPaymentIntentForBook, retrievePaymentDetails, createSubscription,updateSubscription,retrieveSubscriptionDetails,cancelSubscription } from '../controllers/paymentController.js';
    // updatePaymentStatus, totalRevenue, revenueInDateRange, refund, 

const PaymentRoutes = express.Router();

PaymentRoutes.get('/retrievePaymentDetails/:sessionId', retrievePaymentDetails);
PaymentRoutes.get('/retrieveSubscriptionDetails/:subscriptionId', retrieveSubscriptionDetails);
PaymentRoutes.post('/create-subscription', createSubscription);
PaymentRoutes.get('/createPaymentIntent', createPaymentIntentForBook);
PaymentRoutes.delete('/cancelPaymentIntent/:paymentIntentId', cancelSubscription);
PaymentRoutes.patch('/update-subscription', updateSubscription);


export default PaymentRoutes;