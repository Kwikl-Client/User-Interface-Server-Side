// models/chapterModel.js
import mongoose from 'mongoose';

const SceneSchema = new mongoose.Schema({
  sceneNumber: { type: Number, required: true },
  description: { type: String, required: true }
}, { _id: false });

const ChapterSchema = new mongoose.Schema({
  chapterName: { type: String, required: true },
  scenes: [SceneSchema],
  epilogue: { type: String},
  wots: { type: String},
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }
}, { timestamps: true });

const Chapter = mongoose.model('Chapter', ChapterSchema);

export default Chapter;
