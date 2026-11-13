import express from "express";
import multer from "multer";
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";


const router = express.Router();

// ✅ Multer setup for memory storage (Buffers instead of file paths)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

// ✅ Product Route
router.post("/add", upload, addProduct);
router.get("/list", listProduct);
router.get("/single/:productId", singleProduct);
router.post("/remove/:id", removeProduct);

export default router;
