import express from 'express';
import customerModel from '../models/customerModel.js'; // Adjust path to your customerModel.js

const router = express.Router();

// API to mark a game level as played
router.post('/markLevelPlayed', async (req, res) => {
  try {
    const { email, level } = req.body;

    // Input validation
    if (!email || !level) {
      return res.status(400).json({ message: 'Email and level are required' });
    }

    // Validate level is a valid level number
    const validLevels = ['1', '2', '3', '4', '5'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: `Invalid level. Must be one of: ${validLevels.join(', ')}` });
    }

    // Find user by email
    const user = await customerModel.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Define allowed levels based on customerType
    const allowedLevels = {
      reader: ['1', '2'],
      member: ['1', '2', '3'],
      follower: ['1', '2', '3', '4'],
      star: ['1', '2', '3', '4', '5'],
      admin: ['1', '2', '3', '4', '5'],
    };

    const userType = user.customerType.toLowerCase();
    if (!allowedLevels[userType].includes(level)) {
      return res.status(403).json({
        message: `User with customerType '${userType}' is not allowed to play Level ${level}`,
      });
    }

    // Check if level is already in gameLevelsPlayed
    const levelExists = user.gameLevelsPlayed.find(entry => entry.level === level);
    if (levelExists) {
      if (levelExists.played) {
        return res.status(200).json({ message: `Level ${level} already marked as played` });
      }
      levelExists.played = true;
    } else {
      user.gameLevelsPlayed.push({ level, played: true });
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: `Level ${level} marked as played for user ${email}`,
      gameLevelsPlayed: user.gameLevelsPlayed,
    });
  } catch (error) {
    console.error('Error marking level played:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API to fetch user's played levels
router.get('/getPlayedLevels/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email
    const user = await customerModel.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return gameLevelsPlayed array
    res.status(200).json({
      message: 'Played levels retrieved successfully',
      gameLevelsPlayed: user.gameLevelsPlayed,
      totalLevelsPlayed: user.gameLevelsPlayed.filter(level => level.played).length,
    });
  } catch (error) {
    console.error('Error fetching played levels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
