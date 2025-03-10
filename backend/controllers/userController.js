// import validator from "validator";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { Resend } from "resend";
// import userModel from "../models/userModel.js";

// dotenv.config(); // Load environment variables

// // ✅ Ensure RESEND API Key is available
// if (!process.env.RESEND_API_KEY) {
//   console.error("❌ RESEND_API_KEY is missing in .env file!");
//   process.exit(1); // Stop execution
// }

// const resend = new Resend(process.env.RESEND_API_KEY);


// // 🔹 Function to create JWT token
// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // ✅ Route for User Registration
// // export const registerUser = async (req, res) => {
// //   try {
// //     const { name, email, password,validemail } = req.body;
// //     console.log("Registering user:", name);

// //     // Check if user exists
// //     const exists = await userModel.findOne({ email });
// //     if (exists) {
// //       return res.status(400).json({ success: false, message: "User already exists" });
// //     }

// //     // Validate email and password
// //     if (!validator.isEmail(email)) {
// //       return res.status(400).json({ success: false, message: "Please enter a valid email" });
// //     }

// //   // Generate 6-digit Verification Code
// //   const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
// //   const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
// // if(validemail!=validCode){
// //   return res.status(400).json({success: false, message: "verification code is incorrect" })
// // }

// //     //hide the pass word feild and sign up firld unclickable upto the the valid code is not satisfiesd  after checking with verify email here make the 
// //     if (password.length < 8) {
// //       return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
// //     }

// //     // Hash Password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

  
// //     // Create new user entry
// //     const newUser = await userModel.create({
// //       name,
// //       email,
// //       password: hashedPassword, // Store hashed password
// //       verifyCode,
// //       verifyCodeExpiry,
// //     });

// //     // Send Verification Email via Resend
// //     await resend.emails.send({
// //       from: "sharmarish9826@gmail.com", // Change to a verified sender
// //       to: email,
// //       subject: "Email Verification Code",
// //       html: `<p>Your verification code is <strong>${verifyCode}</strong>. It expires in 10 minutes.</p>`,
// //     });

// //     res.status(201).json({ success: true, message: "User registered successfully. Verification email sent." });
// //   } catch (error) {
// //     console.error("Error registering user:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // };


// // export const verifyEmail = async(req,res)=>{
// //   try{
// //     const {email} = req.body;
// //     console.log("verifying email :" email);
 
// //     if (!validator.isEmail(email)) {
// //       return res.status(400).json({ success: false, message: "Please enter a valid email" });
// //     }
    
// //     const exists = await userModel.findOne({ email });
// //     if (exists) {
// //       return res.status(400).json({ success: false, message: "User already exists" });
// //     }

// //    // Generate 6-digit Verification Code
// //    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
// //    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
 
// //    // Send Verification Email via Resend
// //    await resend.emails.send({
// //     from: "sharmarish9826@gmail.com", // Change to a verified sender
// //     to: email,
// //     subject: "Email Verification Code",
// //     html: `<p>Your verification code is <strong>${verifyCode}</strong>. It expires in 10 minutes.</p>`,
// //   });
 
 
// //   }
// //   catch (error){
// //     console.error("Login error:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
  
// //   }
// // };
// // export const registerUser1 =async(req,res)=>{
// //   try{
// //  const {name ,email,password,verifycode}= req.body;
// //  console.log("registering user",name );
// //  if(validemail!=validCode){
// //   return res.status(400).json({success: false, message: "verification code is incorrect" })
// // }

// // if (password.length < 8) {
// //   return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
// // }
// //      // Hash Password
// //      const salt = await bcrypt.genSalt(10);
// //      const hashedPassword = await bcrypt.hash(password, salt);
 
   
// //      // Create new user entry
// //      const newUser = await userModel.create({
// //        name,
// //        email,
// //        password: hashedPassword, // Store hashed password
// //        verifyCode,
// //        verifyCodeExpiry,
// //      });

// //      res.status(201).json({ success: true, message: "User registered successfully. Verification email sent." });

// //   }catch (error){
// //     console.error("Login error:", error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
  
// //   }
// // }

// export const verifyEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("Verifying email:", email);

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Please enter a valid email" });
//     }

//     const exists = await userModel.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     // Generate 6-digit Verification Code
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     // Save verification code in the database (temporary entry)
//     await userModel.findOneAndUpdate(
//       { email },
//       { verifyCode, verifyCodeExpiry },
//       { upsert: true, new: true }
//     );

//     // Send Verification Email via Resend
//     await resend.emails.send({
//       from: "sharmarish9826@gmail.com", // Change to a verified sender
//       to: email,
//       subject: "Email Verification Code",
//       html: `<p>Your verification code is <strong>${verifyCode}</strong>. It expires in 10 minutes.</p>`,
//     });

//     res.status(200).json({ success: true, message: "Verification email sent successfully." });
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Resend } from "resend";
import userModel from "../models/userModel.js";

dotenv.config(); // Load environment variables

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in .env file!");
  process.exit(1); // Stop execution
}

const resend = new Resend(process.env.RESEND_API_KEY);


// 🔹 Function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔹 Function to send verification email
export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Verifying email:", email);

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate 6-digit Verification Code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store verification code in DB
    await userModel.findOneAndUpdate(
      { email },
      { verifyCode, verifyCodeExpiry },
      { upsert: true, new: true }
    );

    // Send email using Resend
    await resend.emails.send({
      from: "you@yourdomain.com", // Use a verified sender email!
      to: email,
      subject: "Email Verification Code",
      html: `<p>Your verification code is <strong>${verifyCode}</strong>. It expires in 10 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, verifyCode } = req.body;
    console.log("Registering user:", name);

    // Fetch user from DB
    const user = await userModel.findOne({ email });

    // if (!user || user.verifyCode !== verifyCode || new Date() > user.verifyCodeExpiry) {
    //   return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    // }

    if (!user ) {
      return res.status(400).json({ success: false, message: "Invalid 1 or expired verification code" });
    }

    if ( user.verifyCode !== verifyCode ) {
      return res.status(400).json({ success: false, message: "Invalid 2 or expired verification code" });
    }

    if ( new Date() > user.verifyCodeExpiry) {
      return res.status(400).json({ success: false, message: "Invalid 3 or expired verification code" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user in DB
    user.name = name;
    user.password = hashedPassword;
    user.verifyCode = null;
    user.verifyCodeExpiry = null;
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Route for User Registration (After Email Verification)
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, verifycode } = req.body;
//     console.log("Registering user:", name);

//     // Find user entry with the verification code
//     const user = await userModel.findOne({ email });

//     if (!user || user.verifyCode !== verifycode || new Date() > new Date(user.verifyCodeExpiry)) {
//       return res.status(400).json({ success: false, message: "Verification code is incorrect or expired" });
//     }

//     if (password.length < 8) {
//       return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
//     }

//     // Hash Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Update user entry and store hashed password
//     user.name = name;
//     user.password = hashedPassword;
//     user.verifyCode = undefined;
//     user.verifyCodeExpiry = undefined;
//     await user.save();

//     res.status(201).json({ success: true, message: "User registered successfully." });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



// ✅ Route for User Login


// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
// console.log(req.body);

//     // Find user
//     const user = await userModel.findOne({ email });
//     console.log("🔵 User from DB:", user);

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User does not exist" });
//     }
//     console.log(user.password);

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     // Generate JWT Token
//     const token = createToken(user._id);
//     res.json({ success: true, token });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


export const loginUser = async (req, res) => {
  try {
    console.log("🟢 Received request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.error("❌ Email or password missing:", { email, password });
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      console.error("❌ User not found:", email);
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    console.log("🔵 User from DB:", user);
    console.log("🟡 Comparing passwords:", { entered: password, stored: user.password });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🟢 Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

      // Generate JWT Token
      const token = createToken(user._id);
      res.json({ success: true, token });

  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request for:", email);

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    // Generate a new 6-digit OTP
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

    console.log("Generated reset code:", resetCode);

    // Store reset code in the database
    user.verifyCode = resetCode;
    user.verifyCodeExpiry = resetCodeExpiry;
    await user.save();

    // Send email with reset code
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "your-verified-email@domain.com",
      to: email,
      subject: "Password Reset Code",
      html: `<p>Your password reset code is <strong>${resetCode}</strong>. It expires in 10 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: "Password reset email sent successfully." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    console.log("Resetting password for:", email);
    console.log("Resetting password for:", resetCode);
    console.log("Resetting password for:", newPassword);

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const user = await userModel.findOne({ email });

    if (!user ) {
      return res.status(400).json({ success: false, message: "Invalid1 or expired reset code" });
    }
    if ( user.verifyCode !== resetCode ) {
      return res.status(400).json({ success: false, message: "Invalid2 or expired reset code" });
    }
    if ( new Date() > user.verifyCodeExpiry) {
      return res.status(400).json({ success: false, message: "Invalid3 or expired reset code" });
    }

    // Reset verification fields before updating the password
    user.verifyCode = null;
    user.verifyCodeExpiry = null;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Route for Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Route to Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token via middleware
    console.log("Extracted userId from token:", userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
