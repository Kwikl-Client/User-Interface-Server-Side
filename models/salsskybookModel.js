import mongoose from 'mongoose';

const { Schema } = mongoose;

const pageSchema = new Schema({
  pageNumber: { type: Number, required: true },
  content: { type: String, required: true }
});

const chapterSchema = new Schema({
  chapterName: { type: String, required: true },
  pages: [pageSchema]
});

const ebookSchema = new Schema({
  bookTitle: { type: String, required: true },
  chapters: [chapterSchema]
});

const SalsskyBookModel = mongoose.model('SalsskyBook', ebookSchema);

export default SalsskyBookModel;
