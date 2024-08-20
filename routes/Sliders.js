import express from 'express';
import { editSliderContent, getSliderContent } from '../controllers/levelsSliderController.js';
const router = express.Router();

router.get('/slider-content', getSliderContent);
router.patch('/edit-slider-content', editSliderContent);


export default router;