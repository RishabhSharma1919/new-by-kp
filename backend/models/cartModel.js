// import mongoose, { mongo } from "mongoose";

// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   items: {
//     type: Array,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },


//   paymentMethod: {
//     type: String,
//     required: true,
//   },
//   payment: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },
//   date: {
//     type: Number,
//     required: true,
//   },
// });

// const cartModel =
//   mongoose.models.cart || mongoose.model("cart", cartSchema);
// export default cartModel;

import mongoose from "mongoose";

// import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String, default:null },  // Add image URL
  description: { type: String, default:"not of art section" }, // Add description
});


const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: { type: [itemSchema], default: [] },
  amount: { type: Number, required: true, default: 0 },
  paymentMethod: { type: String, enum: ["pending", "card", "paypal", "cash"], default: "pending" },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Date, default: Date.now },
});
const cartModel = mongoose.model('Cart', cartSchema);


// Fetch cart and populate product details (description & image)
const getCart = async (userId) => {
  try {
    const cart = await cartModel
    .findOne({ userId })
    .populate("items.itemId", "description image"); // Only fetch description & image
    return cart;
    
  } catch (error) {
    console.log(error);
  }
};

export default cartModel