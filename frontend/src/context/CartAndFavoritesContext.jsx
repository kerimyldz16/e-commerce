import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartAndFavoritesContext = createContext();

export const useCartAndFavorites = () => {
  return useContext(CartAndFavoritesContext);
};

export const CartAndFavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Cart itemlerini fetchle
  const fetchCartItems = useCallback(async () => {
    //oturum açılmamışsa fonksiyondan çık.
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

  // Favorite itemlerini fetchle!
  // her render işleminde useEffect dependency fonksiyonlarının gereksiz yere tekrar oluşturulmaması için useCallback kullan!
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
  //current user değiştiğinde cart ve favorites çek
  useEffect(() => {
    if (currentUser) {
      fetchCartItems();
      fetchFavorites();
    }
  }, [currentUser, fetchCartItems, fetchFavorites]);

  // productları cart'a ekle!
  const handleAddToCart = async (product) => {
    if (!currentUser) {
      toast.info("Please login to add items to your cart.");
      return;
    }

    try {
      const existingItem = cartItems.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        // existing item tekrar eklendiğinde quantity arttır!
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("user_id", currentUser.id)
          .eq("product_id", product.id);

        if (error) {
          console.error("Error updating cart:", error.message);
          toast.error("Error updating cart.");
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
          toast.success("Cart updated successfully.");
        }
      } else {
        // Cart'a yeni product ekle!
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
          toast.error("Error adding to cart.");
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
          toast.success("Product added to cart!");
        }
      }
    } catch (error) {
      console.error("Unexpected error adding to cart:", error);
      toast.error("Unexpected error adding to cart.");
    }
  };

  // favorites'e yeni product ekle!
  const handleAddToFavorites = async (product) => {
    if (!currentUser) {
      toast.info("Please login to add items to your favorites.");
      return;
    }

    const existingItem = favorites.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      toast.info("This item is already added to favorites.");
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
        toast.error("Error adding to favorites.");
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
        toast.success("Product added to favorites!");
      }
    } catch (error) {
      console.error("Unexpected error adding to favorites:", error);
      toast.error("Unexpected error adding to favorites.");
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
      toast.error("Error removing from cart.");
    } else {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );
      toast.success("Product removed from cart.");
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
      toast.error("Error removing from favorites.");
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
      toast.error("Error updating quantity.");
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast.success("Quantity updated successfully.");
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
