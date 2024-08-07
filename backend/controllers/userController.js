import { supabase } from "../config/supabase.js";

// Get user's favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { data, error } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a product to user's favorites
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { product_id } = req.body;

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, product_id }]);

    if (error) throw error;
    res.status(200).json({ message: "Favorite added successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from user's favorites
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { product_id } = req.body;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", product_id);

    if (error) throw error;
    res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's cart items
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a product to user's cart
export const addCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { product_id, quantity } = req.body;

    const { error } = await supabase
      .from("cart_items")
      .insert([{ user_id: userId, product_id, quantity }]);

    if (error) throw error;
    res.status(200).json({ message: "Cart item added successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from user's cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { product_id } = req.body;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", product_id);

    if (error) throw error;
    res.status(200).json({ message: "Cart item removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity of a product in user's cart
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { product_id, quantity } = req.body;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", userId)
      .eq("product_id", product_id);

    if (error) throw error;
    res.status(200).json({ message: "Cart item updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
