import express from "express";
import upload from "../middleware/multer.js";
import { uploadImage } from "../upload/cloudinaryUpload.js";
import connectCloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();
connectCloudinary(); // Ensure Cloudinary is configured

uploadRouter.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = await uploadImage(req.file.buffer);
    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});

export default uploadRouter;

