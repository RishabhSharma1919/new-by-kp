import mongoose from "mongoose";

const readersSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: [false, "User ID is required"], 
  }, 
  timestamp: { type: Date, default: Date.now }
});


const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    author: { type: String, default: "", immutable: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    readers: { type: [readersSchema], default: [] }, // Changed `userId` to `readers`
  },
  { timestamps: true }
);

// Prevent model re-registration
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
