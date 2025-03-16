import express from "express";
import { checkout } from "../controllers/checkoutController.js";

const checkoutRouter = express.Router();

// Get user cart (GET request with authentication)
checkoutRouter.post("/checkout",checkout);

export default checkoutRouter;