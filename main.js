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
// import OnePlus from "./routes/plusOne.js";
import { createServer } from "http";
import { Server } from "socket.io";

colors.enable();
dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // Wrap Express app in HTTP server for Socket.io
const io = new Server(server, { 
  cors: { origin: '*' } // Adjust for production (e.g., your frontend domain)
});

// Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// In-memory stores for user status (use Redis or your DB for production)
const userSockets = new Map(); // userId -> Set of socket IDs
const userStatus = new Map(); // userId -> { isOnline: boolean, lastSeen: Date }

// Socket.io authentication middleware (customize with your auth, e.g., JWT)
io.use((socket, next) => {
  const { userId } = socket.handshake.auth; // Assume userId passed from client (e.g., via JWT decode)
  if (!userId) {
    return next(new Error('Authentication failed'));
  }
  socket.userId = userId;
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  const { userId } = socket;

  // Track sockets per user (for multi-tab/device support)
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socket.id);

  // Update and broadcast online status
  userStatus.set(userId, { isOnline: true, lastSeen: new Date() });
  socket.broadcast.emit('userStatusUpdate', { userId, status: 'online' });

  // Heartbeat: Server pings client every 30s to confirm activity
  const heartbeatInterval = setInterval(() => {
    socket.emit('heartbeat');
  }, 30000);

  socket.on('heartbeatResponse', () => {
    userStatus.set(userId, { isOnline: true, lastSeen: new Date() });
  });

  // Handle explicit offline (e.g., from client on page unload)
  socket.on('userOffline', () => {
    userStatus.set(userId, { isOnline: false, lastSeen: new Date() });
    socket.broadcast.emit('userStatusUpdate', { userId, status: 'offline' });
  });

  // Disconnect handler: Clean up and broadcast if last socket
  const handleDisconnect = () => {
    userSockets.get(userId)?.delete(socket.id);
    if (userSockets.get(userId)?.size === 0) {
      userStatus.set(userId, { isOnline: false, lastSeen: new Date() });
      socket.broadcast.emit('userStatusUpdate', { userId, status: 'offline' });
      userSockets.delete(userId);
    }
    clearInterval(heartbeatInterval);
  };

  socket.on('disconnect', handleDisconnect);
});

// REST endpoint for non-realtime status queries (e.g., for initial load)
app.get('/api/user/:userId/status', (req, res) => {
  const { userId } = req.params;
  const status = userStatus.get(userId) || { isOnline: false, lastSeen: null };
  res.json({
    isOnline: status.isOnline,
    lastActiveAt: status.lastSeen ? status.lastSeen.toISOString() : null
  });
});

// NEW: REST endpoint to fetch all users' statuses (for initial load in frontend)
app.get('/api/users/status', (req, res) => {
  const statuses = Array.from(userStatus.entries()).map(([userId, status]) => ({
    customId: userId,
    isOnline: status.isOnline,
    lastActiveAt: status.lastSeen ? status.lastSeen.toISOString() : null
  }));
  res.json({ success: true, data: statuses });
});

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
// app.use("/one-plus", OnePlus);

// Fetch all meetings
app.get("/meetings", async (req, res) => {
  try {
    const response = await fetch(DAILY_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
        Accept: "application/json", // Fixed: Added proper Accept header
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
        Authorization: `Bearer ${DAILY_API_KEY}`,
        Accept: "application/json", // Fixed: Changed from "/" to "application/json"
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
const port = PORT || 7000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`.bold.brightGreen);
});

