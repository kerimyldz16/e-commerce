import React, { createContext, useContext, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

const CartAndFavoritesContext = createContext();

export const handleLogout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      alert("Logged out successfully");
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
      alert("Failed to log out. Please try again.");
    });
};

export const useCartAndFavorites = () => {
  return useContext(CartAndFavoritesContext);
};

export const CartAndFavoritesProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleAddToFavorites = (product) => {
    setFavorites((prevItems) => {
      if (!prevItems.some((item) => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const handleRemoveFromFavorites = (productId) => {
    setFavorites((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const value = {
    handleLogout,
    cartItems,
    favorites,
    handleAddToCart,
    handleAddToFavorites,
    handleRemoveFromCart,
    handleRemoveFromFavorites,
    handleUpdateQuantity,
  };

  return (
    <CartAndFavoritesContext.Provider value={value}>
      {children}
    </CartAndFavoritesContext.Provider>
  );
};
