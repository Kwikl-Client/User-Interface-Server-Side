import express from 'express';
import mongoose from 'mongoose';
import customerModel from '../models/customerModel.js'; // Import Customer model
import Meeting from '../models/meetingsModel.js'; // Import Meeting model
import Comment from '../models/commentModel.js'; // Import Comment model

const router = express.Router();

// API to fetch user data with various filters
router.get('/user-data', async (req, res) => {
  const {
    userType,  // Comma-separated list of userTypes
    status,  // Filter for meeting status
    startDate,  // Start date for payment range
    endDate,    // End date for payment range
    email,      // Filter by email
    subscription,  // Filter by subscription type (monthly, yearly, jumbo)
    amountPaid, // Minimum payment amount (optional)
    meetingType, // Type of meeting (e.g., one-on-one, group)
    meetingDate, // Specific meeting date filter
    upgradedDate, // Filter for upgraded date
    taskAttempt, // Optional task attempts filter
    starPiece, // Optional starPiece filter
    payAmount, // Optional filter for amount to be paid
    attendersType, // Attendees type for meetings (admin, reader, etc.)
    totalFee, // Optional filter for totalFee
    payableAmount, // Optional filter for payable amount
  } = req.query;

  try {
    // Prepare the filters for customers
    let customerFilters = {};

    // Filter by userType (comma-separated list)
    if (userType) {
      const userTypes = userType.split(','); // Split by commas if multiple userTypes
      customerFilters['customerType'] = { $in: userTypes }; // Match any of the provided userTypes
    }

    // Filter by subscription type (if provided)
    if (subscription) {
      customerFilters['subscriptionDetails.packageType'] = subscription;
    }

    // Filter by payment amount (if provided)
    if (amountPaid) {
      customerFilters['amtPaid'] = { $gte: Number(amountPaid) };
    }

    // Filter by email (if provided)
    if (email) {
      customerFilters['email'] = { $regex: email, $options: 'i' }; // Case-insensitive search
    }

    // Filter by payment date range (if provided)
    if (startDate && endDate) {
      customerFilters['stripeDetails.timestamp'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 1. Fetch customers based on the filters
    const customers = await customerModel.find(customerFilters);

    if (!customers.length) {
      return res.status(404).json({
        success: false,
        message: "No customers found matching the filters.",
      });
    }

    // Prepare the filters for meetings
    let meetingFilters = {};

    // Filter by meeting status (if provided)
    if (status) {
      meetingFilters.status = status;
    }

    // Filter by meeting type (if provided)
    if (meetingType) {
      meetingFilters.meetingType = meetingType;
    }

    // Filter by meeting date (if provided)
    if (meetingDate) {
      meetingFilters.date = { $eq: new Date(meetingDate) }; // Exact match for date
    }

    // Filter by userType for meetings (if provided)
    if (userType) {
      const userTypes = userType.split(',');  // Handle multiple user types
      meetingFilters['participants.role'] = { $in: userTypes };  // Filter participants by role/userType
    }

    // Filter by upgraded date (if provided)
    if (upgradedDate) {
      meetingFilters.upgradedDate = new Date(upgradedDate);
    }

    // Filter by taskAttempt (if provided)
    if (taskAttempt) {
      meetingFilters.taskAttempt = taskAttempt;
    }

    // 2. Fetch meeting data based on the filters
    const meetings = await Meeting.aggregate([
      {
        $match: meetingFilters,  // Apply the meeting filters dynamically
      },
      {
        $lookup: {
          from: 'customers',  // Join with the Customer model to get user details
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'participantDetails',
        },
      },
      {
        $unwind: '$participantDetails',  // Unwind the array to get individual participants
      },
      {
        $project: {
          title: 1,
          date: 1,
          status: 1,
          'participantDetails.name': 1,
          'participantDetails.email': 1,
          'participantDetails.customerType': 1,
          'participantDetails.subscriptionDetails': 1,
        },
      },
    ]);

    // Prepare the filters for comments
    let commentFilters = {};
    // Filter comments by customer if needed
    if (email) {
      commentFilters['customers'] = { $in: customers.map(c => mongoose.Types.ObjectId(c._id)) };
    }

    // // 3. Fetch comment data from Comment Model related to the customer
    // const comments = await Comment.find(commentFilters)
    //   .populate('books', 'title author')  // Optional, if you want book details with the comments
    //   .exec();

    return res.status(200).json({
      success: true,
      data: {
        customers,
        meetings,
        // comments,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user data.",
    });
  }
});

export default router;
