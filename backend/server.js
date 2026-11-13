import "./config/polyfill.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory and then current working directory
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

import morgan from "morgan"; // ✅ Logging middleware
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import upload from "./middleware/multer.js";
import uploadrouter from "./routes/uploadRoutes.js";
import router from "./routes/productRoutes.js";
import wishRouter from "./routes/wishRoute.js";
import blogRouter from "./routes/blogRoutes.js";
import checkoutRouter from "./routes/checkoutRoute.js";
import Razorpay from "razorpay";
import paymentrouter from "./routes/paymentRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to Database and Cloudinary at startup
connectDB().catch((err) => console.warn("MongoDB startup notice:", err.message));
try {
  connectCloudinary();
} catch (err) {
  console.warn("Cloudinary startup notice:", err.message);
}

const razorpayKeyId =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== "your_key_id"
    ? process.env.RAZORPAY_KEY_ID
    : "rzp_test_placeholder";

const razorpayKeySecret =
  process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== "your_key_secret"
    ? process.env.RAZORPAY_KEY_SECRET
    : "placeholder_secret";

export const instance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

// ✅ CORS Configuration (Dynamically reflect origin so credentials work across browser & mobile)
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// ✅ Database connection middleware for Serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("MongoDB request connection notice:", err.message);
  }
  next();
});

// ✅ Middleware
app.use(morgan("dev")); // Logs requests in the console
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ API Routes
app.use("/api/upload", uploadrouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/payment", paymentrouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/wishlist", wishRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/blog", blogRouter);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 API WORKING");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// ✅ Start Server (only when running locally, Vercel exports app directly)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port} ❤️`);
  });
}

export default app; // ✅ Correct export for Vercel
