import validator from "validator";
import bcrypt from "bcryptjs"; // Use bcryptjs
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";

let token = null; // Define a global variable to store the token

const createToken = (id) => {
  token = jwt.sign({ id }, process.env.JWT_SECRET); // Store the token in the variable
  return token;
};

// Route for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;    

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // bcryptjs is used here

    if (isMatch) {
      createToken(user._id); // Token is now stored in the global variable

      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// Route for user register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name);

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10); // bcryptjs is used here
    const hashedPassword = await bcrypt.hash(password, salt); // bcryptjs is used here

    const newUser = new userModel({ name, email, password: hashedPassword });

    const user = await newUser.save();

    createToken(user._id); // Token is now stored in the global variable

    res.json({ success: true, token });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// Route for Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      token = jwt.sign(email + password, process.env.JWT_SECRET); // Store the token
      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};