import express from "express";
import multer from "multer";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  removeBlog,
  likeBlog,
} from "../controllers/blogController.js";
import authUser from "../middleware/auth.js";

const blogRouter = express.Router();

// ✅ Multer setup for handling image uploads in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
}).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

// ✅ Blog Routes
blogRouter.post("/create", upload, createBlog);       // Create a new blog (Admin only)
blogRouter.get("/listBlog", getAllBlogs);                 // Get all blogs (with pagination & search)
blogRouter.get("/single/:blogId", getSingleBlog);     // Get a single blog by ID (increments views)
blogRouter.put("/update/:id", upload, updateBlog);  // Update a blog (Admin only)
blogRouter.delete("/remove/:id", removeBlog);         // Delete a blog (Admin only)
blogRouter.patch("/like",authUser ,likeBlog);              // Like a blog (Public API)

export default blogRouter;
