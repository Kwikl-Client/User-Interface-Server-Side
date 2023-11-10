import express from 'express';
import { registerCustomer, loginCustomer, getAllCustomers, editCustomerPassword } from '../controllers/customerController.js';
import { protect } from '../middlewares/authmiddlewares.js';

const CustomerRoutes = express.Router();

CustomerRoutes.post('/registerCustomer',  registerCustomer);
CustomerRoutes.post('/loginCustomer', loginCustomer);
CustomerRoutes.get('/getAllCustomer', getAllCustomers);
CustomerRoutes.patch('/editCustomerPassword', protect, editCustomerPassword);

export default CustomerRoutes;
