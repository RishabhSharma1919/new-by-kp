
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },

});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
  
    images: { type: [String], required: true }, // Store images as an array
    createdAt: {
        type: Date,
        default: Date.now,
      },
  adminuserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },  
      updatedAt: {
        type: Date,
        default: Date.now,
      },
});

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;


