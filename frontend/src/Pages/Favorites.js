import React from "react";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.js";
import "../Styles/Favorites.css";

const Favorites = () => {
  const { favorites, handleRemoveFromFavorites } = useCartAndFavorites();

  return (
    <div className="favorites-container">
      <h1>Your Favorites</h1>
      <ul className="favorites-list">
        {favorites.length === 0 ? (
          <p>No favorite products added.</p>
        ) : (
          favorites.map((product) => (
            <li
              key={product.product_id} // Use only product_id since it's unique per user
              className="favorite-item"
            >
              <h3>{product.product_name}</h3>
              <p>Price: ${product.product_price}</p>
              <button
                onClick={() => handleRemoveFromFavorites(product.product_id)}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Favorites;
