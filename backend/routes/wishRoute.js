import express from "express";
import { addtowish, getuserwishlist, removefromWish } from "../controllers/wishController.js";
import authUser from "../middleware/auth.js";

const wishRouter = express.Router();

wishRouter.post("/add", authUser, addtowish);
wishRouter.post("/remove", authUser, removefromWish);
wishRouter.get("/get", authUser, getuserwishlist);

export default wishRouter;
