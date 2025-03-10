// import express from "express";
// import {
//   addToCart,
//   getUserCart,
//   updateCart,
// } from "../controllers/cartController.js";
// import authUser from "../middleware/auth.js";

// const cartRouter = express.Router();

// cartRouter.get("/get", authUser, getUserCart);
// cartRouter.post("/add", authUser, addToCart);
// cartRouter.post("/update", authUser, updateCart);

// export default cartRouter;

import express from "express";
import { addToCart, deletecart, getUserCart, updateCart } from "../controllers/cartController.js";
import authUser from "../middleware/auth.js"; // Middleware for authentication

const cartRouter = express.Router();

// Get user cart (GET request with authentication)
cartRouter.get("/get", authUser, getUserCart);
//remove user cart
cartRouter.delete("/clear", authUser, deletecart);


// Add item to cart (POST request)
cartRouter.post("/add", authUser, addToCart);

// Update cart (PUT request)
cartRouter.put("/update", authUser, updateCart);

export default cartRouter;
