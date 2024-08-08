import { supabase } from "../config/supabase.js";

// User favorilerini fetchle
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

// user favorilerine ekle
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

// user favorilerini silme
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

// user cart'ı fetchleme
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

// user cart'a product ekleme
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

// user cart'tan product silme
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

// user'ın cart'ındaki ürünlerin quantity'sini arttırma
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
