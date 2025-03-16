
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true }, // Store images as an array
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    bestSeller: { type: Boolean, required: true },
    art1: { type: Boolean, required: true },
    art2: { type: Boolean, required: true },
    art3: { type: Boolean, required: true },
    art4: { type: Boolean, required: true },
    art5: { type: Boolean, required: true },
    length: { type: Number, required: true },
    breadth: { type: Number, required: true },
    size: { type: String },
});

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;


