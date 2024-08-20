import express from "express";
import mongoose from "mongoose";
import Comment from "../models/commentModel.js";
import Books from "../models/bookModel.js";

const router = express.Router();

// Get comments for a book
router.get("/:bookId", async (req, res) => {
  try {
    const comments = await Comment.find({ book: req.params.bookId, isDeleted: false })
      .populate("customers")
      .populate("replies");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a comment
router.post("/addComment", async (req, res) => {
  const { bookId, customers, text,customerShortId } = req.body;

  // Validate that bookId and customId are provided
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: "Invalid bookId format" });
  }

  if (!customers) {
    return res.status(400).json({ message: "customId is required" });
  }
console.log(customerShortId);
  console.log('bookId:', bookId);
  console.log('customId:', customers);

  const comment = new Comment({
    books: bookId,
    customers: customers,
    customerShortId:customerShortId,
    text,
  });

  try {
    const newComment = await comment.save();

    // Find the book and update its comments array
    const book = await Books.findById(bookId);
    if (book) {
      book.comments.push(newComment._id);
      await book.save();
    }

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like - Unlike a comment
router.post("/:commentId/like", async (req, res) => {
  const { commentId } = req.params;
  const { customerShortId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    // Validate customId
    if (!mongoose.Types.ObjectId.isValid(customerShortId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    const isLiked = comment.likes.includes(customerShortId);

    if (isLiked) {
      // If already liked, unlike the comment
      comment.likes = comment.likes.filter((id) => id.toString() !== customerShortId);
    } else {
      // If not liked, like the comment
      comment.likes.push(customerShortId);
    }

    const updatedComment = await comment.save();

    res.status(200).json({
      message: isLiked ? "Comment unliked successfully!" : "Comment liked successfully!",
      updatedComment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Reply to a comment
router.post("/:commentId/reply", async (req, res) => {
  const { book, customers, text,customerShortId } = req.body;

  const reply = new Comment({
    book: book,
    customers: customers,
    text,
    customerShortId:customerShortId,
   
  });

  try {
    const newReply = await reply.save();
    const comment = await Comment.findById(req.params.commentId);
    comment.replies.push(newReply._id);
    await comment.save();
    res.status(201).json(newReply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { customerShortId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.customerShortId.toString() !== customerShortId) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Mark the comment as deleted
    comment.isDeleted = true;
    comment.deletedAt = new Date();

    await comment.save();

    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const checkEditTimeFrame = (entity) => {
  const now = new Date();
  const lastEditTime = entity.updatedAt || entity.createdAt; // Fallback to createdAt if updatedAt is not set

  const timeDifference = (now - lastEditTime) / 1000; // Time difference in seconds

  return timeDifference <= 60; // 60 seconds = 1 minute
};

router.patch("/:commentId/edit", async (req, res) => {
  const { commentId } = req.params;
  const { text, customerShortId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the requester is the author of the comment
    if (comment.customerShortId !== customerShortId) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    // Check if the comment is within the 1-minute editing time frame
    if (!checkEditTimeFrame(comment)) {
      return res.status(403).json({ message: "Time frame for editing has expired" });
    }

    // Update the comment text and timestamp
    comment.text = text;
    comment.updatedAt = new Date(); // Update the timestamp

    await comment.save();

    res.status(200).json({ message: "Comment updated successfully!", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:commentId/reply/:replyId/edit", async (req, res) => {
  const { text, customerShortId } = req.body;
  const { commentId, replyId } = req.params;

  try {
    // Log the incoming IDs and body
    console.log(`Comment ID: ${commentId}`);
    console.log(`Reply ID: ${replyId}`);
    console.log(`Request Body:`, req.body);

    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ message: "Invalid comment or reply ID" });
    }

    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Log found comment
    console.log(`Found Comment:`, comment);

    // Find the reply within the comment
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Log found reply
    console.log(`Found Reply:`, reply);

    // Check if the requester is the author of the reply
    if (reply.customerShortId !== customerShortId) {
      return res.status(403).json({ message: "You are not authorized to edit this reply" });
    }

    // Check if the reply is within the 1-minute editing time frame
    if (!checkEditTimeFrame(reply)) {
      return res.status(403).json({ message: "Time frame for editing has expired" });
    }

    // Update the reply text and timestamp
    reply.text = text;
    reply.updatedAt = new Date(); // Update the timestamp

    await comment.save();

    res.status(200).json({ message: "Reply edited successfully", reply });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ message: err.message });
  }
});



export default router;
