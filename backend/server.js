import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan"; // ✅ Logging middleware
import connectDB from "./config/mongodb.js";
//import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import upload from "./middleware/multer.js";
import uploadrouter from "./routes/uploadRoutes.js";
import router from "./routes/productRoutes.js";
import wishRouter from "./routes/wishRoute.js";
const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// ✅ CORS Configuration (Restrict Allowed Origins)

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Change "*" to frontend URL in production
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173", // ✅ Set your frontend URL
//     credentials: true,
//   })
// );


// ✅ Middleware
app.use(morgan("dev")); // Logs requests in the console
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ API Routes
app.use("/api/upload",uploadrouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/wishlist",wishRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 API WORKING");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port} ❤️`);
});
