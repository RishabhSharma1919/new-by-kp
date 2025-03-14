import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Proper timestamp definition
  wish: { type: Boolean, required: true },
});

const wishSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: { type: [itemSchema], default: [] },
});

const WishModel = mongoose.model("Wish", wishSchema);
export default WishModel;
