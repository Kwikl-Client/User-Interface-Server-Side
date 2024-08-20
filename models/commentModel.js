import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    books: { type: mongoose.Schema.Types.ObjectId, ref: 'books' },
    customers: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
    customerShortId: { type: String, required: true },
    // CustomId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customers' }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
  deletedAt: { type: Date } // Timestamp of deletion
});

export default mongoose.model('Comment', commentSchema);
