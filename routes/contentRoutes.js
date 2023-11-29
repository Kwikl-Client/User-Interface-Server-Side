import express from 'express';
import { editHero, editCharacters, editOverview, editAuthor, editOffer,
getHero, getCharacters, getOverview, getAuthor, getOffer } from '../controllers/contentController.js';
import upload from '../middlewares/multermiddlewares.js';
import uploadImg from '../middlewares/uploadFilemiddlewares.js';
const ContentRoutes = express.Router();

ContentRoutes.patch('/editHero', editHero);
ContentRoutes.patch('/editCharacters/:_id', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editCharacters);
ContentRoutes.patch('/editOverview', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editOverview);
ContentRoutes.patch('/editAuthor', upload.fields([{ name: 'image', maxCount: 1 },]), uploadImg, editAuthor);
ContentRoutes.patch('/editOffer', editOffer);

ContentRoutes.get('/getHero', getHero);
ContentRoutes.get('/getCharacters', getCharacters);
ContentRoutes.get('/getOverview', getOverview);
ContentRoutes.get('/getAuthor', getAuthor);
ContentRoutes.get('/getOffer', getOffer);

export default ContentRoutes;
