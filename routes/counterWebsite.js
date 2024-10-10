import express from 'express';
import Visitor from '../models/vistorsModel.js';
import moment from 'moment';

const router = express.Router();

// Middleware to count visitors per day
const countVisitors = async (req, res, next) => {
  const currentDate = moment().format('YYYY-MM-DD');

  try {
    let todayRecord = await Visitor.findOne({ date: currentDate });

    if (todayRecord) {
      // Increment the visitor count if today's record exists
      todayRecord.count += 1;
    } else {
      // Create a new record for today
      todayRecord = new Visitor({ date: currentDate, count: 1 });
    }

    // Save the record to the database
    await todayRecord.save();
    console.log(`Visitor count for ${currentDate}: ${todayRecord.count}`);
    next();
  } catch (err) {
    console.error('Error updating visitor count:', err);
    res.status(500).send('Internal server error');
  }
};

// Route to display today's visitor count and likes
router.get('/', countVisitors, async (req, res) => {
  const currentDate = moment().format('YYYY-MM-DD');

  try {
    const todayRecord = await Visitor.findOne({ date: currentDate });
    const count = todayRecord ? todayRecord.count : 0;
    const likes = todayRecord ? todayRecord.likes : 0; // Get likes
    res.status(200).json({ success: true, message: 'Visitor count and likes', data: { count, likes } });
  } catch (err) {
    res.status(500).send('Error retrieving visitor count');
  }
});

// Route to increment likes
router.post('/like', async (req, res) => {
  try {
    // Increment the likes for today's record
    const todayRecord = await Visitor.findOne({ date: moment().format('YYYY-MM-DD') });

    if (todayRecord) {
      // Increment the likes if today's record exists
      todayRecord.likes += 1;
      await todayRecord.save();
    } else {
      // Create a new record for today with likes
      const newRecord = new Visitor({ date: moment().format('YYYY-MM-DD'), count: 0, likes: 1 });
      await newRecord.save();
    }

    // Count all likes from all records
    const totalLikes = await Visitor.aggregate([
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    const likesCount = totalLikes.length > 0 ? totalLikes[0].totalLikes : 0;

    res.status(200).json({ success: true, message: 'Likes updated', totalLikes: likesCount });
  } catch (err) {
    console.error('Error updating likes count:', err);
    res.status(500).send('Internal server error');
  }
});


// Route to display all visitor counts
router.get('/all', async (req, res) => {
  try {
    const allRecords = await Visitor.find({});
    res.json(allRecords);
  } catch (err) {
    res.status(500).send('Error retrieving visitor data');
  }
});

export default router;
