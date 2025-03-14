
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
  
    images: { type: [String], required: true }, // Store images as an array
    createdAt: {
        type: Date,
        default: Date.now,
      },
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },  
});

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;


