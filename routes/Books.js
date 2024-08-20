import express from "express";
import mongoose from "mongoose";
import Books from "../models/bookModel.js";

const router = express.Router();
const REPLY_DEPTH = 8;

// Recursive function to populate comments and replies of replies
const getCommentPopulateOptions = (depth) => {
  if (depth === 0) {
    return {
      path: "replies",
      populate: [
        { path: "customers", model: "customers" },
        { path: "likes", model: "customers" },
      ],
    };
  }

  return {
    path: "replies",
    populate: [
      { path: "customers", model: "customers" },
      { path: "likes", model: "customers" },
      getCommentPopulateOptions(depth - 1),
    ],
  };
};

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Books.find()
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "customers", model: "customers" },
          { path: "likes", model: "customers" },
          getCommentPopulateOptions(REPLY_DEPTH),
        ],
      })
      .exec();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a book by id
router.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Books.findById(bookId)
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "customers", model: "customers" },
          { path: "likes", model: "customers" },
          getCommentPopulateOptions(REPLY_DEPTH),
        ],
      })
      .exec();

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like - Unlike a book
router.post("/:bookId/like", async (req, res) => {
  const { bookId } = req.params;
  const { customId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(customId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const book = await Books.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already liked the comment
    const isLiked = Books.likes.includes(customId);

    if (isLiked) {
      // If already liked, unlike the comment
      Books.likes = Books.likes.filter((id) => id.toString() !== customId);
    } else {
      // If not liked, like the comment
      Books.likes.push(customId);
    }

    const updatedBook = await Books.save();

    res.status(200).json({
      message: isLiked ? "Book unliked successfully!" : "Book liked successfully!",
      updatedBook,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a book
router.post("/addBook", async (req, res) => {
  const { bookname, bookImage } = req.body;

  const book = new Book({
    bookname,
    bookImage,
  });

  try {
    const newBook = await Books.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
