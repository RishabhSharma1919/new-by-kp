// import cartModel from "../models/cartModel.js";
// import userModel from "../models/userModel.js";

// //ADD PRODUCT TO USER CART
// export const addToCart = async (req, res) => {
//   try {
//     const { userId, itemId, size } = req.body;

//     const userData = await userModel.findById(userId);
//     const cartData = await userData.cartData;

//     if (cartData[itemId]) {
//       if (cartData[itemId][size]) {
//         cartData[itemId][size] += 1;
//       } else {
//         cartData[itemId][size] = 1;
//       }
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][size] = 1;
//     }

//     await userModel.findByIdAndUpdate(userId, { cartData });

//     res.json({ success: true, message: "Added to cart" });
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//   }
// };

// //UPDATE  USER CART
// export const updateCart = async (req, res) => {
//   try {
//     const { userId, itemId, size, quantity } = req.body;
//     const userData = await userModel.findById(userId);
//     const cartData = await userData.cartData;

//     cartData[itemId][size] = quantity;

//     await userModel.findByIdAndUpdate(userId, { cartData });

//     res.json({ success: true, message: "Cart updated" });
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//   }
// };

// //GET USER CART
// export const getUserCart = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const userData = await userModel.findById(userId);
//     const cartData = await userData.cartData;

//     res.json({ success: true, cartData });
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//   }
// };

//updating user cart daata

import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";

// ADD PRODUCT TO USER CART
export const addToCart = async (req, res) => {
  try {
console.log("=====",req.user);

    const userId =  req.user?.id
    const {  itemId, size, price } = req.body;
// console.log(size);

    if (!userId || !itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      cart = new cartModel({ userId, items: [], amount: 0, paymentMethod: "pending", date: Date.now() });
      // console.log(cart);
    }

    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId && item.size === size);
// console.log(itemIndex);

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ itemId, size, quantity: 1, price });
    }

    cart.amount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();

    res.json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE CART ITEM QUANTITY
export const updateCart = async (req, res) => {
  try {
    const userId =  req.user?.id;
    const {  itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size || quantity < 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId && item.size === size);

    if (itemIndex !== -1) {
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else {
      return res.status(400).json({ success: false, message: "Item not found in cart" });
    }

    cart.amount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();

    res.json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER CART
export const getUserCart = async (req, res) => {
  try {
    const userId =  req.user?.id;

    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const cart = await cartModel.findOne({ userId });
console.log("======",cart);

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    res.json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PLACE ORDER (CLEAR CART AFTER ORDER)
export const placeOrder = async (req, res) => {
  try {
    const userId =  req.user?.id;
    const {  items, amount, address, paymentMethod } = req.body;

    if (!userId || !items || !amount || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    cart.amount = 0;
    cart.payment = true;

    await cart.save();

    res.json({ success: true, message: "Order placed successfully", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
