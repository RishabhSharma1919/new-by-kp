import { v2 as cloudinary } from "cloudinary";
import Blog from "../models/blogModel.js";
import { uploadImage } from "../upload/cloudinaryupload.js";

// ✅ Create a Blog
export const createBlog = async (req, res) => {
    try {
    //   if (!req.user || !req.user.isAdmin) {
    //     return res.status(403).json({ error: "Admin access required" });
    //   }
  
      const { title, description } = req.body;
      const imageBuffers = ["image1", "image2", "image3", "image4"]
        .map((key) => req.files?.[key]?.[0]?.buffer)
        .filter(Boolean);
      
      const imageUrls = await Promise.all(imageBuffers.map(uploadImage));
  
      if (!imageUrls.length) {
        return res.status(400).json({ error: "At least one image must be uploaded." });
      }
  
      const newBlog = new Blog({
        title,
        description,
        images: imageUrls,
        author:  "Rishi ",
        readers: [], // Ensure it is an empty array

      });
  
      await newBlog.save();
      res.status(201).json({ message: "Blog added successfully!", blog: newBlog });
    } catch (error) {
      console.error("Error adding blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
// ✅ Get Single Blog


// ✅ Remove a Blog
export const removeBlog = async (req, res) => {
    try {
    //   if (!req.user || !req.user.isAdmin) {
    //     return res.status(403).json({ error: "Admin access required" });
    //   }
  
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: "Blog ID is required" });
      }
  
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
  
      await Promise.all(
        blog.images.map(async (url) => {
          const publicId = url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        })
      );
  
      await Blog.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Blog Removed" });
    } catch (error) {
      console.error("Error removing blog:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// ✅ Public Like Feature (Without Sign-In)
export const likeBlog = async (req, res) => {
    try {
      const { id } = req.body; 
      if (!id) {
        return res.status(403).json({ success: false, message: "Blog ID is required" });
      }
  
      const userId = req.user.id; 
      if (!userId) {
        return res.status(401).json({ success: false, message: "Sign in to like blogs" });
      }
  
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
  
      // Check if user has already liked the blog
      const likeIndex = blog.readers.findIndex((reader) => reader.userId.toString() === userId);
  
      if (likeIndex !== -1) {
        // User has already liked → Unlike it
        blog.readers.splice(likeIndex, 1);
        blog.likes -= 1;
      } else {
        // User hasn't liked yet → Like it
        blog.readers.push({ userId });
        blog.likes += 1;
      }
  
      await blog.save();
  
      res.status(200).json({ success: true, likes: blog.likes, liked: likeIndex === -1 }); // `liked` is true if just liked
    } catch (error) {
      console.error("❌ Error liking/unliking blog:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  export const updateBlog = async (req, res) => {
    try {
    //   if (!req.user || !req.user.isAdmin) {
    //     return res.status(403).json({ error: "Admin access required" });
    //   }
  
      const { id } = req.params//mongoose.Types.ObjectId(req.blogId);
      console.log("this is a",id);
      if (!id) {
        return res.status(400).json({ success: false, message: "Blog ID is required" });
      }
      const { title, description } = req.body;
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(406).json({ success: false, message: "Blog not found" });
      }
  
      // Handle image updates
      const imageBuffers = ["image1", "image2", "image3", "image4"]
        .map((key) => req.files?.[key]?.[0]?.buffer)
        .filter(Boolean);
  
      let imageUrls = blog.images; // Keep existing images if no new ones are uploaded
  
      if (imageBuffers.length > 0) {
        // Delete old images from Cloudinary
        await Promise.all(
          blog.images.map(async (url) => {
            const publicId = url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          })
        );
  
        // Upload new images
        imageUrls = await Promise.all(imageBuffers.map(uploadImage));
      }
  
      // Update blog details
      blog.title = title || blog.title;
      blog.description = description || blog.description;
      blog.images = imageUrls;
      blog.updatedAt = Date.now();
  
      await blog.save();
  
      res.status(200).json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  export const getAllBlogs = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query; // Pagination & search
      const skip = (page - 1) * limit;
  
      const query = search
        ? { title: { $regex: search, $options: "i" } } // Case-insensitive search
        : {};
  
      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 }) // Latest blogs first
        .skip(skip)
        .limit(Number(limit))
        .lean();
  
      const totalBlogs = await Blog.countDocuments(query); // Get total count
  
      res.status(200).json({
        success: true,
        totalPages: Math.ceil(totalBlogs / limit),
        currentPage: Number(page),
        totalBlogs,
        blogs,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

  export const getSingleBlog = async (req, res) => {
    try {
      const { blogId } = req.params;
      
  console.log(req.params);
      if (!blogId) {
        return res.status(400).json({ success: false, message: "Blog ID is required" });
      }
  
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(406).json({ success: false, message: "Blog not found" });
      }
  
      // Increment view count
      blog.views += 1;
      await blog.save();
  
      res.status(200).json({ success: true, blog });
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  