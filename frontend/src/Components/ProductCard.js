import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { FaHeart } from "react-icons/fa";
import "../Styles/ProductCard.css";

const ProductCard = ({ product, onAddToCart, onAddToFavorites }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleAddToCartClick = () => {
    if (!currentUser) {
      alert("Please Login");
      navigate("/login");
    } else {
      onAddToCart(product);
    }
  };

  const handleAddToFavoritesClick = () => {
    if (!currentUser) {
      alert("Please Login");
      navigate("/login");
    } else {
      onAddToFavorites(product);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <div className="product-actions">
          <button onClick={handleAddToCartClick}>Sepete Ekle</button>
          <button onClick={handleAddToFavoritesClick}>
            <FaHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
