import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { fileURLToPath } from "url";

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



const { DAILY_API_URL, DAILY_API_KEY, PORT } = process.env;

// Exit if Daily.co API credentials are missing
if (!DAILY_API_URL || !DAILY_API_KEY) {
  console.error("DAILY_API_URL or DAILY_API_KEY is missing in environment variables!");
  process.exit(1);
}
app.options("*", cors()); // Enables preflight for all routes

// Routes
app.use("/customer", CustomerRoutes);
app.use("/payment", PaymentRoutes);
app.use("/books", booksRouter);
app.use("/comments", commentsRouter);
app.use("/chapters", ChaptersRouter);
app.use("/counter", counterWebsite);
app.use("/dashboard", dashboardRouter);
app.use("/send-feedback", feedbackRouter);
app.use("/meeting", Meetings);


// Daily.co: fetch all meetings
app.get("/meetings", async (req, res) => {
  try {
    const response = await fetch(DAILY_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch Daily.co rooms");

    const rooms = await response.json();
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});

// Daily.co: schedule meeting
app.post("/api/schedule", async (req, res) => {
  const { title, date } = req.body;

  try {
    const response = await fetch(DAILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
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

    if (!response.ok) throw new Error("Failed to create Daily.co room");

    const room = await response.json();

    const newMeeting = {
      id: room.name,
      title,
      date,
      url: room.url,
    };

    console.log(newMeeting);
    res.status(201).json(newMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to schedule meeting" });
  }
});

// ------------------------
// ✅ Serve React Frontend
// ------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, "../git_react/build"), {
  setHeaders: (res, filePath) => {
    if (
      filePath.endsWith(".js") ||
      filePath.endsWith(".css") ||
      filePath.endsWith(".woff2") ||
      filePath.endsWith(".png") ||
      filePath.endsWith(".jpg") ||
      filePath.endsWith(".svg") ||
      filePath.endsWith(".ico") ||
      filePath.endsWith(".mp3")
    ) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  }
}));

// React SPA fallback (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../git_react/build", "index.html"));
});

// ------------------------
// ✅ Start Server
// ------------------------

const port = PORT || 4000;
app.listen(port, () => {
  console.log(` Server started on port ${port}`.bold.brightGreen);
});


