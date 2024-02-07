import express from 'express';
import { protect } from '../middlewares/authmiddlewares.js';
import { editHero, editCharacters, editOverview, editAuthor, editOffer, editUltimate, editFomoAuthor,
getHero, getCharacters, getOverview, getAuthor, getOffer, getUltimateHero, getFomoAuthor,
getBook, getFreeBook, insertChapter, getChapters, deleteChapter, editRefund, getRefund, 
editReviews, getReviews, editPolicy, getPolicy, editUserAgreement, getUserAgreement, editTndC, getTndC} from '../controllers/contentController.js';
import upload from '../middlewares/multermiddlewares.js';
import uploadImg from '../middlewares/uploadFilemiddlewares.js';
const ContentRoutes = express.Router();

ContentRoutes.patch('/editHero', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editHero);
ContentRoutes.patch('/editCharacters/:_id', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editCharacters);
ContentRoutes.patch('/editOverview', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editOverview);
ContentRoutes.patch('/editAuthor', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editAuthor);
ContentRoutes.patch('/editOffer', editOffer);
ContentRoutes.patch('/editPolicy', editPolicy);
ContentRoutes.patch('/editAgreement', editUserAgreement);
ContentRoutes.patch('/editTndC', editTndC);
ContentRoutes.patch('/editUltimate',upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editUltimate);
ContentRoutes.patch('/editrefund',editRefund);
ContentRoutes.patch('/editreviews',editReviews);
ContentRoutes.patch('/editfomoAuthor', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editFomoAuthor);
ContentRoutes.post('/insertChapter', insertChapter);
ContentRoutes.get('/getChapters', getChapters);
ContentRoutes.delete('/deleteChapters/:id', deleteChapter);    
ContentRoutes.get('/getHero', getHero);
ContentRoutes.get('/getCharacters', getCharacters);
ContentRoutes.get('/getOverview', getOverview);
ContentRoutes.get('/getAuthor', getAuthor);
ContentRoutes.get('/getOffer', getOffer);
ContentRoutes.get('/getPolicy', getPolicy);
ContentRoutes.get('/getTndC', getTndC);
ContentRoutes.get('/getAgreement', getUserAgreement);
ContentRoutes.get('/getFomoAuthor', getFomoAuthor);
ContentRoutes.get('/getUltimate',getUltimateHero);
ContentRoutes.get('/getBook', protect, getBook);
ContentRoutes.get('/getRefund',getRefund);
ContentRoutes.get('/getReview',getReviews);
ContentRoutes.get('/getFreeBook', getFreeBook);

export default ContentRoutes;
