import express from 'express';
import { allUsersData,registerCustomer, loginCustomer,acceptCookiePolicy,editCustomerDetails, 
    raiseCommunityRequest, verifyTkn, checkEmail, forgotPassword,dailyUserCount,
    starUserCheck
} from '../controllers/customerController.js';
import { protect } from '../middlewares/authmiddlewares.js';
import uploadImg from '../middlewares/uploadFilemiddlewares.js';
import upload from '../middlewares/multermiddlewares.js';

const CustomerRoutes = express.Router();
CustomerRoutes.get('/dailyUserCount',dailyUserCount);
CustomerRoutes.post('/allUsers', allUsersData);
CustomerRoutes.post('/registerCustomer', registerCustomer);
CustomerRoutes.post('/loginCustomer', loginCustomer);
CustomerRoutes.get('/verifyTkn/:token', verifyTkn);
CustomerRoutes.post('/checkUser', checkEmail);
CustomerRoutes.patch('/editCustomerDetails', 
    protect,
    editCustomerDetails
);
CustomerRoutes.get('/raiseCommunityRequest/:email', raiseCommunityRequest)
CustomerRoutes.post('/forgotPassword', forgotPassword);
CustomerRoutes.post('/acceptPolicy', protect, acceptCookiePolicy);
export default CustomerRoutes;
