import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./utils/connectDb.js";
import PaymentRoutes from "./routes/paymentRoutes.js";
import CustomerRoutes from "./routes/customerRoutes.js";
import booksRouter from "./routes/Books.js";
import commentsRouter from "./routes/Comments.js";
import ChaptersRouter from "./routes/chapters.js";
import slidersRouter from "./routes/sliders.js"

colors.enable();
dotenv.config();
connectDB();
const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/customer", CustomerRoutes);
app.use("/payment", PaymentRoutes);
app.use('/books', booksRouter);
app.use('/comments', commentsRouter);
app.use('/chapters', ChaptersRouter);
app.use('/content', slidersRouter)

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`.bold.brightGreen);
});