import express from 'express';
import { editHero, editCharacters, editOverview, editAuthor, editOffer,
getHero, getCharacters, getOverview, getAuthor, getOffer } from '../controllers/contentController.js';
// import upload from '../middlewares/multermiddlewares.js';

const ContentRoutes = express.Router();

ContentRoutes.patch('/editHero', editHero);
ContentRoutes.patch('/editCharacters/:_id', editCharacters);
ContentRoutes.patch('/editOverview', editOverview);
ContentRoutes.patch('/editAuthor', editAuthor);
ContentRoutes.patch('/editOffer', editOffer);

ContentRoutes.get('/getHero', getHero);
ContentRoutes.get('/getCharacters', getCharacters);
ContentRoutes.get('/getOverview', getOverview);
ContentRoutes.get('/getAuthor', getAuthor);
ContentRoutes.get('/getOffer', getOffer);

export default ContentRoutes;
