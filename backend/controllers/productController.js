import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

export const addProduct = async (req, res) => {
console.log(req.files);

  console.log("Request Body:", req.body);
  
  console.log("Uploaded Files:", req.files);

  try {
    const { name, description, price, category, subCategory, sizes_breadth,sizes_length, bestSeller, art1, art2, art3, art4, art5 } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Ensure req.files exists and extract the first file from each array
    const images = req.files
      ? [req.files.image1?.[0], req.files.image2?.[0], req.files.image3?.[0], req.files.image4?.[0]].filter(Boolean)
      : [];

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
          return result.secure_url;
        } catch (err) {
          console.error("Cloudinary upload error:", err);
          throw new Error("Image upload failed");
        }
      })
    );

    let sizes = req.body.sizes;


   // Ensure sizes is always an array
   if (typeof sizes === "string") {
       try {
           sizes = JSON.parse(sizes); // Parse only if it's a string
       } catch (error) {
           console.error("Error parsing sizes:", error);
           sizes = []; // Fallback to an empty array
       }
   } else if (!Array.isArray(sizes)) {
       sizes = []; // Ensure it's an array
   }
   
   // Log the final sizes array
   console.log("Final sizes array:", sizes);
   

// Parse boolean values properly
const productData = new productModel({
  name,
  description,
  category,
  price: Number(price),
  subCategory,
  bestSeller: JSON.parse(bestSeller || "false"),
  art1: JSON.parse(art1 || "false"),
  art2: JSON.parse(art2 || "false"),
  art3: JSON.parse(art3 || "false"),
  art4: JSON.parse(art4 || "false"),
  art5: JSON.parse(art5 || "false"),
  sizes,  // ✅ Now correctly parsed
  sizes_length,
  sizes_breadth,
  image: imagesUrl,
  date: Date.now(),
});


    await productData.save();
    res.status(201).json({ success: true, message: "Product Added", product: productData });
  } catch (e) {
    console.error("Error adding product:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};



// Function to list all products
export const listProduct = async (req, res) => {
  try {
    console.log("=====================");
    
    const products = await productModel.find();
    // console.log(products);
    
    res.status(200).json({ success: true, products });
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

// Function to remove a product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product Removed" });
  } catch (e) {
    console.error("Error removing product:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

// Function to get single product info
export const singleProduct = async (req, res) => {
  try {
    console.log('======');
    
    console.log(req);
    
    const { productId } = req.query; // Change from req.body to req.query
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (e) {
    console.error("Error fetching product:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};