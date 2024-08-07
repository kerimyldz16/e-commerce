// src/Components/ProductCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { FaHeart } from "react-icons/fa";
import "../Styles/ProductCard.css";

const ProductCard = ({ product, onAddToCart, onAddToFavorites, onClick }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const handleAddToCartClick = async () => {
    if (!currentUser) {
      alert("Please Login");
      navigate("/login");
    } else {
      setCartLoading(true); // Set loading to true when adding to cart
      await onAddToCart(product);
      setCartLoading(false); // Reset loading state
    }
  };

  const handleAddToFavoritesClick = async () => {
    if (!currentUser) {
      alert("Please Login");
      navigate("/login");
    } else {
      setFavoritesLoading(true); // Set loading to true when adding to favorites
      await onAddToFavorites(product);
      setFavoritesLoading(false); // Reset loading state
    }
  };

  const handleProductNameClick = () => {
    navigate("/", { state: { searchQuery: product.name } });
  };

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      {" "}
      {/* Make entire card clickable */}
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3 className="product-name" onClick={handleProductNameClick}>
          {product.name}
        </h3>
        <p className="product-price">${product.price}</p>
        <div className="product-actions">
          <button onClick={handleAddToCartClick} disabled={cartLoading}>
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>
          <button
            onClick={handleAddToFavoritesClick}
            disabled={favoritesLoading}
          >
            {favoritesLoading ? "Adding..." : <FaHeart />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
