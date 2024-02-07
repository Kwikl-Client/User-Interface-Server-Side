import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import PaymentRoutes from "./routes/paymentRoutes.js";
import CustomerRoutes from "./routes/customerRoutes.js";
import connectDB from "./utils/connectDb.js";
import ContentRoutes from "./routes/contentRoutes.js";

colors.enable();
dotenv.config();
connectDB();
const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors());

//GET, POST, PUT, PATCH, DELETE
app.use("/payment", PaymentRoutes);
app.use("/customer", CustomerRoutes);
app.use("/cms", ContentRoutes);

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`.bold.brightGreen);
});