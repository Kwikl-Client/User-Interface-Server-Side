import mongoose from 'mongoose';

// Define the scene schema
const sceneSchema = new mongoose.Schema({
  sceneNumber: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false }); // To avoid adding _id for each scene (optional)

// Define the chapter schema
const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
    required: true
  },
  scenes: {
    type: [sceneSchema], // Array of scene objects
    default: []
  },
  epilogue: {
    type: String,
    default: ''
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Assuming you have a Book model for reference
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // This will automatically handle createdAt and updatedAt timestamps

// Create a model for Chapter
const Preview = mongoose.model('Preview', chapterSchema);

export default Preview;
