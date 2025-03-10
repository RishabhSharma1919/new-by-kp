

//updating user cart daata

import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";

// ADD PRODUCT TO USER CART
// 


export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { itemId, size, price, description, uploadedImage } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [],
        amount: 0,
        paymentMethod: "pending",
        date: Date.now(),
        image: uploadedImage || "hello", // Ensure an empty string if no image is provided
      });
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.itemId === itemId && item.size === size
    );

    if (itemIndex !== -1 && uploadedImage==="") {
      // If the item exists, increase its quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // Otherwise, add the new item
      cart.items.push({
        itemId,
        size,
        quantity: 1,
        price,
        description,
        image: uploadedImage || "", // Default to empty string if no image
      });
    }

    // Recalculate cart total amount
    cart.amount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();

    return res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
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
// export const placeOrder = async (req, res) => {
//   try {
//     const userId =  req.user?.id;
//     const {  items, amount, address, paymentMethod } = req.body;

//     if (!userId || !items || !amount || !address || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const cart = await cartModel.findOne({ userId });

//     if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

//     cart.items = [];
//     cart.amount = 0;
//     cart.payment = true;

//     await cart.save();

//     res.json({ success: true, message: "Order placed successfully", cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
export const deletecart = async (req, res) => {
  try {
    const userId = req.user?.id;  // Ensure user ID is available

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // 🗑 Delete the cart for the logged-in user
    const result = await cartModel.findOneAndDelete({ userId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





//updating user cart daata

// import cartModel from "../models/cartModel.js";
// import userModel from "../models/userModel.js";

// // ADD PRODUCT TO USER CART
// export const addToCart = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const { itemId, size, price, description, uploadedImage } = req.body;

//     if (!userId || !itemId || !size) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     let cart = await cartModel.findOne({ userId });

//     if (!cart) {
//       cart = new cartModel({
//         userId,
//         items: [],
//         amount: 0,
//         paymentMethod: "pending",
//         date: Date.now(),
//       });
//     }

//     const itemIndex = cart.items.findIndex((item) => item.itemId === itemId && item.size === size);

//     if (itemIndex !== -1) {
//       cart.items[itemIndex].quantity += 1;
//     } else {
//       cart.items.push({ itemId, size, quantity: 1, price, description, image: uploadedImage });
//     }

//     cart.amount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    
//     await cart.save();

//     return res.status(200).json({ success: true, message: "Added to cart", cart });
//   } catch (error) {
//     console.error("Error in addToCart:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// // UPDATE CART ITEM QUANTITY
// export const updateCart = async (req, res) => {
//   try {
//     const userId =  req.user?.id;
//     const {  itemId, size, quantity } = req.body;

//     if (!userId || !itemId || !size || quantity < 0) {
//       return res.status(400).json({ success: false, message: "Invalid data" });
//     }

//     const cart = await cartModel.findOne({ userId });
    

//     if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

//     const itemIndex = cart.items.findIndex((item) => item.itemId === itemId && item.size === size);

//     if (itemIndex !== -1) {
//       if (quantity === 0) {
//         cart.items.splice(itemIndex, 1);
//       } else {
//         cart.items[itemIndex].quantity = quantity;
//       }
//     } else {
//       return res.status(400).json({ success: false, message: "Item not found in cart" });
//     }

//     cart.amount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

//     await cart.save();

//     res.json({ success: true, message: "Cart updated", cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // GET USER CART
// export const getUserCart = async (req, res) => {
//   try {
//     const userId =  req.user?.id;

//     if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

//     const cart = await cartModel.findOne({ userId });
// console.log("======",cart);

//     if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

//     res.json({ success: true, cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // PLACE ORDER (CLEAR CART AFTER ORDER)
// export const placeOrder = async (req, res) => {
//   try {
//     const userId =  req.user?.id;
//     const {  items, amount, address, paymentMethod } = req.body;

//     if (!userId || !items || !amount || !address || !paymentMethod) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const cart = await cartModel.findOne({ userId });

//     if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

//     cart.items = [];
//     cart.amount = 0;
//     cart.payment = true;

//     await cart.save();

//     res.json({ success: true, message: "Order placed successfully", cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// export const deletecart = async (req, res) => {
//   try {
//     const userId = req.user?.id;  // Ensure user ID is available

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User ID is required" });
//     }

//     // 🗑 Delete the cart for the logged-in user
//     const result = await cartModel.findOneAndDelete({ userId });

//     if (!result) {
//       return res.status(404).json({ success: false, message: "Cart not found" });
//     }

//     res.json({ success: true, message: "Cart cleared successfully" });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };





