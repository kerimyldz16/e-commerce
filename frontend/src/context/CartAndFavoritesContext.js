import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";

const CartAndFavoritesContext = createContext();

export const useCartAndFavorites = () => {
  return useContext(CartAndFavoritesContext);
};

export const CartAndFavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from("cart")
        .select("product_id, quantity, product_name, product_price, user_id")
        .eq("user_id", currentUser.id);

      if (error) {
        console.error("Error fetching cart items:", error.message);
      } else {
        setCartItems(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching cart items:", error);
    }
  }, [currentUser]);

  // Fetch favorite items
  const fetchFavorites = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id, product_name, product_price, user_id")
        .eq("user_id", currentUser.id);

      if (error) {
        console.error("Error fetching favorite items:", error.message);
      } else {
        setFavorites(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching favorites:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCartItems();
      fetchFavorites();
    }
  }, [currentUser, fetchCartItems, fetchFavorites]);

  // Handle adding item to cart
  const handleAddToCart = async (product) => {
    if (!currentUser) {
      alert("Please Login");
      return;
    }

    try {
      const existingItem = cartItems.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        // Update the quantity in the cart
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("user_id", currentUser.id)
          .eq("product_id", product.id);

        if (error) {
          console.error("Error updating cart:", error.message);
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        }
      } else {
        // Add new item to the cart
        const { error } = await supabase.from("cart").insert([
          {
            user_id: currentUser.id,
            product_id: product.id,
            quantity: 1,
            product_name: product.name,
            product_price: product.price,
          },
        ]);

        if (error) {
          console.error("Error adding to cart:", error.message);
        } else {
          setCartItems((prevItems) => [
            ...prevItems,
            {
              product_id: product.id,
              quantity: 1,
              product_name: product.name,
              product_price: product.price,
              user_id: currentUser.id,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Unexpected error adding to cart:", error);
    }
  };

  // Handle adding item to favorites
  const handleAddToFavorites = async (product) => {
    if (!currentUser) {
      alert("Please Login");
      return;
    }

    const existingItem = favorites.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      alert("This item is already added to favorites.");
      return;
    }

    try {
      const { error } = await supabase.from("favorites").insert([
        {
          user_id: currentUser.id,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
        },
      ]);

      if (error) {
        console.error("Error adding to favorites:", error.message);
      } else {
        setFavorites((prevItems) => [
          ...prevItems,
          {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            user_id: currentUser.id,
          },
        ]);
      }
    } catch (error) {
      console.error("Unexpected error adding to favorites:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from cart:", error.message);
    } else {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from favorites:", error.message);
    } else {
      setFavorites((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("user_id", currentUser.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error updating quantity:", error.message);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const value = {
    handleAddToCart,
    handleAddToFavorites,
    handleRemoveFromCart,
    handleRemoveFromFavorites,
    handleUpdateQuantity,
    cartItems,
    favorites,
  };

  return (
    <CartAndFavoritesContext.Provider value={value}>
      {children}
    </CartAndFavoritesContext.Provider>
  );
};
