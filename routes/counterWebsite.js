import express from "express";

const router = express.Router();

const COUNT_START = 99;
const INTERVAL_TIME = 1.5 * 60 * 60 * 1000; // 30 minutes

let userCount = COUNT_START; // In-memory counter

// Get current counter
const fetchCounter = (req, res) => {
  res.json({ count: userCount });
};

// Decrement counter every 30 minutes and reset to 99 if it hits 1
const decrementCounter = () => {
  if (userCount > 1) {
    userCount--;
  } else {
    userCount = COUNT_START; // Reset to 99
  }
  console.log(`Counter updated: ${userCount}`);
};

// API route
router.get("/", fetchCounter);

// Start decrement interval
setInterval(decrementCounter, INTERVAL_TIME);

export default router;
