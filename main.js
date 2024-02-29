import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./utils/connectDb.js";
import ContentRoutes from "./routes/contentRoutes.js";
import PaymentRoutes from "./routes/paymentRoutes.js";
import CustomerRoutes from "./routes/customerRoutes.js"

colors.enable();
dotenv.config();
connectDB();
const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/customer", CustomerRoutes);
app.use("/payment", PaymentRoutes);
app.use("/cms", ContentRoutes);

const port = process.env.PORT || 7009;

app.listen(port, () => {
  console.log(`Server started on port ${port}`.bold.brightGreen);
});