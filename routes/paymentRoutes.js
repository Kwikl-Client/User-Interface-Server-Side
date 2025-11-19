import express from 'express';
import { createPaymentIntentForBook, retrievePaymentDetails,
    updateSubscription,retrieveSubscriptionDetails,cancelSubscription, PaymentIntentToAuthor, 
    renewalCheckoutSession,renewSamePlan} from '../controllers/paymentController.js';
    // updatePaymentStatus, totalRevenue, revenueInDateRange, refund, 

const PaymentRoutes = express.Router();

PaymentRoutes.get('/retrievePaymentDetails/:sessionId', retrievePaymentDetails);
PaymentRoutes.get('/retrieveSubscriptionDetails/:subscriptionId', retrieveSubscriptionDetails);
// PaymentRoutes.post('/create-subscription', createSubscription);
PaymentRoutes.get('/renewal-subscription', renewalCheckoutSession);
PaymentRoutes.get('/createPaymentIntent', createPaymentIntentForBook);
PaymentRoutes.post('/payment-talkToAuthor', PaymentIntentToAuthor);
PaymentRoutes.delete('/cancelPaymentIntent', cancelSubscription);
PaymentRoutes.patch('/update-subscription', updateSubscription);
PaymentRoutes.get("/renew-same", renewSamePlan);

export default PaymentRoutes;

