import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    feelings: [String],
    innerSelf: String,
    oneWord: String,
    salsskyRepresent: String,
    sacredGuide: String,
    barriers: [String],
    recommendation: String,
    guidanceEmail: String,
}, {
    timestamps: true,
});

const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

export default FeedbackModel;
