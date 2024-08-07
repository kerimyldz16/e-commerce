// src/routes/userRoutes.js
import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getCartItems,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect routes with authMiddleware
router.use(authMiddleware);

router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites", removeFavorite);

router.get("/cart", getCartItems);
router.post("/cart", addCartItem);
router.delete("/cart", removeCartItem);
router.put("/cart", updateCartItemQuantity);

export default router;
