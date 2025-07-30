import express from 'express';
import { createPaymentIntentForBook, retrievePaymentDetails,
    updateSubscription,retrieveSubscriptionDetails,cancelSubscription, PaymentIntentToAuthor } from '../controllers/paymentController.js';
    // updatePaymentStatus, totalRevenue, revenueInDateRange, refund, 

const PaymentRoutes = express.Router();

PaymentRoutes.get('/retrievePaymentDetails/:sessionId', retrievePaymentDetails);
PaymentRoutes.get('/retrieveSubscriptionDetails/:subscriptionId', retrieveSubscriptionDetails);
// PaymentRoutes.post('/create-subscription', createSubscription);
PaymentRoutes.get('/createPaymentIntent', createPaymentIntentForBook);
PaymentRoutes.post('/payment-talkToAuthor', PaymentIntentToAuthor);
PaymentRoutes.delete('/cancelPaymentIntent/:paymentIntentId', cancelSubscription);
PaymentRoutes.patch('/update-subscription', updateSubscription);


export default PaymentRoutes;
