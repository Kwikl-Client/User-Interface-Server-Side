import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    bookname: { type: String, required: true },
    bookImage: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customers' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

export default mongoose.model('Book', bookSchema);
