import express from 'express';
import { allUsersData,registerCustomer, loginCustomer,acceptCookiePolicy,editCustomerDetails, 
    raiseCommunityRequest, verifyTkn, checkEmail, forgotPassword,dailyUserCount,
    starUserCheck,bookAppointment,
    updateBankDetails,postWhoAmIContent , getWhoAmI,
    getUsersStatus,
    logoutCustomer
} from '../controllers/customerController.js';
import { protect } from '../middlewares/authmiddlewares.js';


const CustomerRoutes = express.Router();
CustomerRoutes.get('/dailyUserCount',dailyUserCount);
CustomerRoutes.get('/allUsers-Status',getUsersStatus);
CustomerRoutes.post('/allUsers', allUsersData);
CustomerRoutes.post('logout', logoutCustomer);
CustomerRoutes.post('/registerCustomer', registerCustomer);
CustomerRoutes.post('/loginCustomer', loginCustomer);
CustomerRoutes.get('/verifyTkn/:token', verifyTkn);
CustomerRoutes.get('/getWhoAmI', getWhoAmI);
CustomerRoutes.post('/whoAmI', postWhoAmIContent);
CustomerRoutes.patch('/editCustomerDetails', 
    protect,
    editCustomerDetails
);
CustomerRoutes.patch('/updateBankDetails',updateBankDetails);
CustomerRoutes.post('/book-appointment-author/:email', bookAppointment)
CustomerRoutes.put('/raiseCommunityRequest/:email', raiseCommunityRequest)
CustomerRoutes.post('/checkStarMember', starUserCheck);
CustomerRoutes.post('/forgotPassword', forgotPassword);
CustomerRoutes.post('/acceptPolicy', protect, acceptCookiePolicy);
export default CustomerRoutes;
