

import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";
import { uploadImage } from "../upload/cloudinaryUpload.js";

export const addProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      category,
      subCategory,
      bestSeller,
      art1,
      art2,
      art3,
      art4,
      art5,
      size,
      length,
      breadth,
    } = req.body;

    // Convert string values to boolean
    bestSeller = bestSeller === "true" || bestSeller === true;
    art1 = art1 === "true" || art1 === true;
    art2 = art2 === "true" || art2 === true;
    art3 = art3 === "true" || art3 === true;
    art4 = art4 === "true" || art4 === true;
    art5 = art5 === "true" || art5 === true;

    // Convert numerical values safely
    price = isNaN(parseFloat(price)) ? 0 : parseFloat(price);
    length = isNaN(parseFloat(length)) ? 0 : parseFloat(length);
    breadth = isNaN(parseFloat(breadth)) ? 0 : parseFloat(breadth);

    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Extract image buffers from req.files
    const imageBuffers = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files?.[key]?.[0]?.buffer)
      .filter(Boolean);

    if (!imageBuffers.length) {
      return res.status(400).json({ success: false, message: "At least one image must be uploaded." });
    }

    // Upload images to Cloudinary and get URLs
    const imageUrls = await Promise.all(imageBuffers.map(uploadImage));
    console.log("Uploaded Image URLs:", imageUrls);

    if (!imageUrls.length) {
      return res.status(400).json({ success: false, message: "Failed to upload image(s) to cloud storage." });
    }

    // Create and save the new product
    const newProduct = new Product({
      name,
      description,
      price,
      category: category || "Devotional",
      subCategory: subCategory || "small A4",
      images: imageUrls, // Store images as an array
      bestSeller,
      art1,
      art2,
      art3,
      art4,
      art5,
      size: size || `${length} x ${breadth}`,
      length,
      breadth,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};



export const listProduct = async (req, res) => {
  try {
    const products = await Product.find().lean();
    if (products.length === 0) {
      return res.status(200).json({ success: true, message: "No products available", products: [] });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Function to remove a product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Remove images from Cloudinary
    if (product.images.length > 0) {
      await Promise.all(
        product.images.map(async (url) => {
          const publicId = url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Function to get a single product's details
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
