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
            <li key={product.id} className="favorite-item">
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <button onClick={() => handleRemoveFromFavorites(product.id)}>
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
