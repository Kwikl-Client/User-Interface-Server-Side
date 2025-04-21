import express from 'express';
import FeedbackModel from '../models/feedbackModel.js';

const router = express.Router();


router.post('/submit', async (req, res) => {
    try {
        const feedbackData = req.body;
        const savedFeedback = await FeedbackModel.create(feedbackData);
        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: savedFeedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while submitting feedback',
        });
    }
});

export default router;
