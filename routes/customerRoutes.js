import express from 'express';
import { registerCustomer, loginCustomer, getAllCustomers, raiseCommunityRequest, editCustomerDetails, verifyTkn, checkEmail, deleteCustomer, getCustomersBetweenDates, forgotPassword, submitReview } from '../controllers/customerController.js';
import { protect } from '../middlewares/authmiddlewares.js';

const CustomerRoutes = express.Router();

CustomerRoutes.post('/registerCustomer', registerCustomer);
CustomerRoutes.post('/loginCustomer', loginCustomer);
CustomerRoutes.post('/getAllCustomer', getAllCustomers);
// CustomerRoutes.post('/registeredUserDetails',userSubmitFormData)
CustomerRoutes.patch('/editCustomerDetails', protect, editCustomerDetails);
CustomerRoutes.get('/verifyTkn/:token', verifyTkn);
CustomerRoutes.post('/checkUser', checkEmail)
CustomerRoutes.get('/deleteCustomer/:email', deleteCustomer)
CustomerRoutes.get('/raiseCommunityRequest/:customId', raiseCommunityRequest)
CustomerRoutes.post('/usersReview/:customerId',submitReview)
CustomerRoutes.get('/getCustomersBetweenDates', getCustomersBetweenDates)
CustomerRoutes.post('/forgotPassword', forgotPassword)

export default CustomerRoutes;
