import express from 'express';
import { 
  getFilteredChapters, 
  getSceneFromChapter, 
  getEpilogueFromChapter, 
  uploadEpilogueContent, 
  uploadSceneContent, 
  deleteSceneFromChapter,
  deleteEpilogueFromChapter,
  getWotsFromChapter,
  uploadWotsForChapter,
  getFirstFourPlotsFromChapter,
} from '../controllers/bookController.js';
import upload from '../middlewares/multermiddlewares.js'; // Import the middleware from the correct file

const router = express.Router();

router.get('/literature', getFilteredChapters);
router.get('/plot', getSceneFromChapter);
router.get('/preview-plots', getFirstFourPlotsFromChapter);

router.get('/epilogue', getEpilogueFromChapter);
router.get('/wots', getWotsFromChapter); // New WOTS route

router.delete('/delete-scene', deleteSceneFromChapter);
router.delete('/delete-epilogue', deleteEpilogueFromChapter);
router.post('/uploadScene', upload.single('file'), uploadSceneContent, (req, res) => {
    res.send('File uploaded successfully');
});
router.post('/uploadEpilogue', upload.single('file'), uploadEpilogueContent, (req, res) => {
    res.send('File uploaded successfully');
});
router.post('/uploadWots', upload.single('file'), uploadWotsForChapter, (req, res) => { // New WOTS upload route
    res.send('File uploaded successfully');
});

export default router;
