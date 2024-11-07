import fs from 'fs/promises'; // Use the promises API for fs operations
import mongoose from 'mongoose';
import path from 'path';
import { extractSceneFromDocument } from '../utils/extractText.js'; 
import {extractEpilogueFromDocument} from '../utils/extractText.js';
import { extractWOTSFromDocument } from '../utils/extractText.js';
import mammoth from 'mammoth';
import Chapter from '../models/chapterModel.js';
import Preview from "../models/previewModel.js";

export const getFilteredChapters = async (req, res) => {
  try {
    const { chapterName, sceneDescription } = req.query;
    let filter = {};

    if (chapterName) {
      filter.chapterName = { $regex: chapterName, $options: 'i' };
    }

    if (sceneDescription) {
      filter['scenes.description'] = { $regex: sceneDescription, $options: 'i' };
    }

    const chapters = await Chapter.find(filter);
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSceneFromChapter = async (req, res) => {
  try {
      const { chapterName, sceneNumber } = req.query;

      if (!chapterName || !sceneNumber) {
          return res.status(400).json({ message: 'Chapter name and scene number are required' });
      }

      const chapter = await Chapter.findOne({
          chapterName: { $regex: new RegExp(chapterName, 'i') }, // Case-insensitive match
          'scenes.sceneNumber': sceneNumber
      }, {
          'scenes.$': 1 // Return only the specific scene
      });

      if (!chapter) {
          return res.status(404).json({ message: 'Chapter or scene not found' });
      }

      res.json(chapter.scenes[0]);
  } catch (error) {
      console.error('Error finding chapter:', error); // Log the error
      res.status(500).json({ message: error.message });
  }
};

export const getFirstFourPlotsFromChapter = async (req, res) => {
  try {
    // Fetch all chapters from the database

    const result = await Preview.find();
    res.json(result);
  } catch (error) {
    console.error('Error finding chapters:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const getEpilogueFromChapter = async (req, res) => {
  try {
    const { chapterName } = req.query;

    if (!chapterName) {
      return res.status(400).json({ message: 'Chapter name is required' });
    }

    const chapter = await Chapter.findOne({ chapterName: chapterName }, { epilogue: 1, _id: 0 });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadSceneContent = async (req, res) => {
  try {
    const { chapterName, sceneNumber } = req.body;

    if (!chapterName || !sceneNumber) {
      return res.status(400).json({ message: 'Chapter name and scene number are required' });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded or file path is empty' });
    }

    const filePath = req.file.path;
    const documentBuffer = await fs.readFile(filePath);
    const sceneDescription = await extractSceneFromDocument(documentBuffer);

    // Find the chapter by name
    let chapter = await Chapter.findOne({ chapterName: chapterName });

    if (!chapter) {
      // If chapter not found, create a new chapter with a new MongoDB ID
      chapter = new Chapter({
        chapterName: chapterName,
        bookId: new mongoose.Types.ObjectId(), // Generate a new MongoDB ObjectId
        epilogue: '', // Provide a default value for epilogue if needed
        scenes: [{ sceneNumber: sceneNumber, description: sceneDescription }]
      });
    } else {
      // If chapter exists, check if the scene exists and update or add new scene
      const sceneIndex = chapter.scenes.findIndex(scene => scene.sceneNumber === sceneNumber);
      if (sceneIndex !== -1) {
        chapter.scenes[sceneIndex].description = sceneDescription;
      } else {
        chapter.scenes.push({ sceneNumber: sceneNumber, description: sceneDescription });
      }
    }

    const updatedChapter = await chapter.save();
    await fs.unlink(filePath); // Clean up the uploaded file

    res.json({
      success: true,
      message: 'Scene content uploaded successfully',
      data: updatedChapter
    });
  } catch (error) {
    console.error('Error uploading scene content:', error);
    res.status(500).json({ message: 'An error occurred while uploading the scene content.' });
  }
};

export const uploadEpilogueContent = async (req, res) => {
  try {
    const { chapterName } = req.body;

    if (!chapterName) {
      return res.status(400).json({ message: 'Chapter name is required' });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded or file path is empty' });
    }

    const filePath = req.file.path;
    const documentBuffer = await fs.readFile(filePath);
    const epilogueContent = await extractEpilogueFromDocument(documentBuffer);

    // Find the chapter by name or create a new one
    let chapter = await Chapter.findOne({ chapterName: chapterName });

    if (!chapter) {
      chapter = new Chapter({
        chapterName: chapterName,
        epilogue: epilogueContent
      });
    } else {
      // Replace the existing epilogue content with the new content
      chapter.epilogue = epilogueContent;
    }

    const updatedChapter = await chapter.save();
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'Epilogue content uploaded successfully',
      data: updatedChapter
    });
  } catch (error) {
    console.error('Error uploading epilogue content:', error);
    res.status(500).json({ message: error.message });
  }
};
export const getWotsFromChapter = async (req, res) => {
  try {
    const { chapterName } = req.query;

    if (!chapterName) {
      return res.status(400).json({ message: 'Chapter name is required' });
    }

    const chapter = await Chapter.findOne({ chapterName: chapterName }, { WOTS: 1, _id: 0 });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Error fetching WOTS:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload WOTS for a chapter
export const uploadWotsForChapter = async (req, res) => {
  try {
    const { chapterName } = req.body;

    if (!chapterName) {
      return res.status(400).json({ message: 'Chapter name is required' });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded or file path is empty' });
    }

    const filePath = req.file.path;
    const documentBuffer = await fs.readFile(filePath);
    const wotsContent = await extractWOTSFromDocument(documentBuffer); // Assuming you have a function to extract WOTS from the document

    // Find the chapter by name or create a new one
    let chapter = await Chapter.findOne({ chapterName: chapterName });

    if (!chapter) {
      chapter = new Chapter({
        chapterName: chapterName,
        wots: wotsContent
      });
    } else {
      // Replace the existing WOTS content with the new content
      chapter.wots = wotsContent;
    }

    const updatedChapter = await chapter.save();
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'WOTS content uploaded successfully',
      data: updatedChapter
    });
  } catch (error) {
    console.error('Error uploading WOTS content:', error);
    res.status(500).json({ message: error.message });
  }
};
  export const deleteSceneFromChapter = async (req, res) => {
    try {
      const { chapterName, sceneNumber } = req.body;
  
      if (!chapterName || !sceneNumber) {
        return res.status(400).json({ message: 'Chapter name and scene number are required' });
      }
  
      const chapter = await Chapter.findOne({ chapterName: chapterName });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
  
      const sceneIndex = chapter.scenes.findIndex(scene => scene.sceneNumber === sceneNumber);
      if (sceneIndex === -1) {
        return res.status(404).json({ message: 'Scene not found' });
      }
      chapter.scenes.splice(sceneIndex, 1);
      const updatedChapter = await chapter.save();
  
      res.json({
        success: true,
        message: 'Scene deleted successfully',
        data: updatedChapter
      });
    } catch (error) {
      console.error('Error deleting scene:', error);
      res.status(500).json({ message: 'An error occurred while deleting the scene.' });
    }
  };

  export const deleteEpilogueFromChapter = async (req, res) => {
    try {
      const { chapterName } = req.body;
  
      if (!chapterName) {
        return res.status(400).json({ message: 'Chapter name is required' });
      }
  
      const chapter = await Chapter.findOne({ chapterName: chapterName });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      if (!chapter.epilogue) {
        return res.status(404).json({ message: 'Epilogue not found' });
      }
      chapter.epilogue = undefined;
      const updatedChapter = await chapter.save();
  
      res.json({
        success: true,
        message: 'Epilogue deleted successfully',
        data: updatedChapter
      });
    } catch (error) {
      console.error('Error deleting epilogue:', error);
      res.status(500).json({ message: 'An error occurred while deleting the epilogue.' });
    }
  };
  
