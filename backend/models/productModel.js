import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true }, // Change image to an array of strings
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes_length: { type: Number, required: true },
    sizes_breadth: { type: Number, required: true },
    bestSeller: { type: Boolean, required: true }, // Change bestSeller to Boolean
    art1: { type: Boolean, required: true }, // Change art1 to Boolean
    art2: { type: Boolean, required: true }, // Change art2 to Boolean
    art3: { type: Boolean, required: true }, // Change art3 to Boolean
    art4: { type: Boolean, required: true }, // Change art4 to Boolean
    art5: { type: Boolean, required: true }, // Change art5 to Boolean
    date: { type: Number, required: true }
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;