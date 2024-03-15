import express from 'express';
import { registerCustomer, loginCustomer, getAllCustomers, raiseCommunityRequest, editCustomerDetails, verifyTkn, checkEmail, deleteCustomer, getCustomersBetweenDates, forgotPassword, submitReview,customerCount, messageRequest, raiseRefundRequest, checkMessageSent } from '../controllers/customerController.js';
import { protect } from '../middlewares/authmiddlewares.js';

const CustomerRoutes = express.Router();

CustomerRoutes.post('/registerCustomer', registerCustomer);
CustomerRoutes.post('/loginCustomer', loginCustomer);
CustomerRoutes.post('/getAllCustomer', getAllCustomers);
CustomerRoutes.post('/messageHelp/:customId', messageRequest);
CustomerRoutes.patch('/editCustomerDetails', protect, editCustomerDetails);
CustomerRoutes.get('/verifyTkn/:token', verifyTkn);
CustomerRoutes.get('/checkMessageSent/:customId', checkMessageSent);
CustomerRoutes.post('/checkUser', checkEmail)
CustomerRoutes.get('/deleteCustomer/:email', deleteCustomer)
CustomerRoutes.get('/raiseCommunityRequest/:customId', raiseCommunityRequest)
CustomerRoutes.get('/raiseRefundRequest/:customId', raiseRefundRequest);
CustomerRoutes.post('/usersReview/:customerId',submitReview)
CustomerRoutes.get('/getCustomersBetweenDates', getCustomersBetweenDates)
CustomerRoutes.post('/forgotPassword', forgotPassword);
CustomerRoutes.get('/dailyUserCount', customerCount);

export default CustomerRoutes;
