import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./utils/connectDb.js";
import PaymentRoutes from "./routes/paymentRoutes.js";
import CustomerRoutes from "./routes/customerRoutes.js";
import booksRouter from "./routes/Books.js";
import commentsRouter from "./routes/Comments.js";
import ChaptersRouter from "./routes/Chapters.js";
import counterWebsite from "./routes/counterWebsite.js";
import dashboardRouter from "./routes/admin.js";
import feedbackRouter from "./routes/feedback.js";
import Meetings from "./routes/meetings.js";

colors.enable();
dotenv.config();
connectDB();

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Dummy in-memory store for meetings (Replace with database in production)
let meetings = [];

const { DAILY_API_URL, DAILY_API_KEY, PORT } = process.env;

// Ensure DAILY_API_URL and DAILY_API_KEY are available
if (!DAILY_API_URL || !DAILY_API_KEY) {
  console.error("DAILY_API_URL or DAILY_API_KEY is missing in environment variables!");
  process.exit(1); // Exit the application if credentials are not provided
}

// Use routes
app.use("/customer", CustomerRoutes);
app.use("/payment", PaymentRoutes);
app.use('/books', booksRouter);
app.use('/comments', commentsRouter);
app.use('/chapters', ChaptersRouter);
app.use('/counter', counterWebsite);
app.use('/dashboard', dashboardRouter);
app.use('/send-feedback', feedbackRouter);
app.use("/meeting", Meetings);

// Fetch all meetings
app.get("/meetings", async (req, res) => {
  try {
    const response = await fetch(DAILY_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`, // Fixed template literal
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Daily.co rooms");
    }

    const rooms = await response.json();
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});

// Schedule a new meeting
app.post("/api/schedule", async (req, res) => {
  const { title, date } = req.body;

  try {
    // Create a new room in Daily.co
    const response = await fetch(DAILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`, // Fixed template literal
        Accept: "/",
      },
      body: JSON.stringify({
        name: title.split(" ").join("-"),
        privacy: "public",
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          start_video_off: true,
          start_audio_off: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Daily.co room");
    }

    const room = await response.json();

    // Save meeting details in mock database (replace with real database logic)
    const newMeeting = {
      id: room.name,
      title,
      date,
      url: room.url,
    };
    console.log(newMeeting);

    meetings.push(newMeeting); // In-memory meeting store (should be replaced with a database)

    res.status(201).json(newMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to schedule meeting" });
  }
});

// Set port and start the server
const port = PORT || 4000; // Use environment variable or default to 3000
app.listen(port, () => {
  console.log(`Server started on port ${port}`.bold.brightGreen);
});
