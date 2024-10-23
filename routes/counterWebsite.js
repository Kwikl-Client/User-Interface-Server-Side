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

router.get('/', async (req, res) => {
  const currentDate = moment().format('YYYY-MM-DD');

  try {
    const todayRecord = await Visitor.findOne({ date: currentDate });
    const count = todayRecord ? todayRecord.count : 0;
    
    // Get total likes across all records
    const totalLikesData = await Visitor.aggregate([
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);
    
    const totalLikes = totalLikesData.length > 0 ? totalLikesData[0].totalLikes : 0;
    res.status(200).json({ success: true, message: 'Visitor count and total likes', data: { count, totalLikes } });
  } catch (err) {
    res.status(500).send('Error retrieving visitor count');
  }
});

// Route to increment likes
router.post('/like', async (req, res) => {
  const currentDate = moment().format('YYYY-MM-DD');

  try {
      // Check for today's record
      let todayRecord = await Visitor.findOne({ date: currentDate });

      if (todayRecord) {
          // If today's record exists, increment the likes
          todayRecord.likes += 1; // Increment existing likes count
          await todayRecord.save(); // Save the updated record
      } else {
          // If no record for today, create a new record with 1 like
          todayRecord = new Visitor({
              date: currentDate,
              count: 0, // You can set visitor count as needed
              likes: 1, // Start with 1 like for the first hit of the day
          });
          await todayRecord.save(); // Save the new record
      }

      // Return the updated likes count for today
      res.status(200).json({ success: true, message: 'Likes updated', likes: todayRecord.likes });
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
