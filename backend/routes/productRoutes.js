import express from "express";
import multer from "multer";
import path from "path";
import { addProduct, listProduct, removeProduct, singleProduct } from "../controllers/productController.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: "uploads/", // Ensure this directory exists
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ✅ Route to add a product (Accept up to 4 images)
router.post("/add", upload.array("images", 4), addProduct);

// ✅ Route to list all products
router.get("/list", listProduct);

// ✅ Route to remove a product
router.delete("/remove", removeProduct);

// ✅ Route to get a single product
router.get("/single", singleProduct);

export default router;
