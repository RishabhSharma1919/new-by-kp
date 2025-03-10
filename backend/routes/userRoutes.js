import express from "express";
import {
   // ✅ Function to send OTP
  verifyEmail, // ✅ Function to verify OTP & register user
  //signUpUser,
   // ✅ Function to register user after verification
  loginUser, // ✅ Function to log in user
  adminLogin, // ✅ Function to log in admin
  getUserDetails,
  registerUser,
  forgotPassword,
  resetPassword, // ✅ Function to fetch user details
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// ✅ CORS Preflight Handling
userRouter.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Change to match frontend URL
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.sendStatus(200);
});

// ✅ API Routes
userRouter.post("/registerUser", registerUser); // 🔹 Step 1: Send OTP
userRouter.post("/forgotpassword", forgotPassword); // 🔹 Step 1: Send OTP
userRouter.post("/resetpassword",resetPassword); // 🔹 Step 1: Send OTP
userRouter.post("/verifyemail", verifyEmail); // 🔹 Step 2: Verify OTP
//userRouter.post("/sign-up", signUpUser); // 🔹 Step 3: Register user after verification
userRouter.post("/login", loginUser); // 🔹 Step 4: User Login
userRouter.post("/admin", adminLogin); // 🔹 Admin Login
userRouter.get("/getUserDetails", authUser, getUserDetails);

export default userRouter;
