import express from 'express';
import { protect } from '../middlewares/authmiddlewares.js';
import { getBook, getFreeBook} from '../controllers/contentController.js';
import upload from '../middlewares/multermiddlewares.js';
import uploadImg from '../middlewares/uploadFilemiddlewares.js';
const ContentRoutes = express.Router();

ContentRoutes.get('/getBook', protect, getBook);
ContentRoutes.get('/getFreeBook', getFreeBook);

export default ContentRoutes;
