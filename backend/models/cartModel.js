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

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [itemSchema],
  amount: { type: Number, required: true, default: 0 },
  paymentMethod: { type: String, required: true, default: "pending" },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true, default: Date.now },
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);
export default cartModel;
