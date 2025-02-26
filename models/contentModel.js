import mongoose from 'mongoose';

const BookSchema = mongoose.Schema(
    {
        chapterName:{
            type: String,
            required: true,
        },
        content:{
            type: [String],
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const bookModel = mongoose.model('book', BookSchema, 'book');


export { bookModel};
