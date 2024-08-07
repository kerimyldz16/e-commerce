// frontend/src/Pages/Favorites.jsx

import React from "react";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";

const Favorites = () => {
  const { favorites, handleRemoveFromFavorites } = useCartAndFavorites();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Favorites</h1>
      <ul className="space-y-4">
        {favorites.length === 0 ? (
          <p className="text-center text-gray-600">
            No favorite products added.
          </p>
        ) : (
          favorites.map((product) => (
            <li
              key={product.product_id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold">{product.product_name}</h3>
              <p className="text-gray-600">Price: ${product.product_price}</p>
              <button
                onClick={() => handleRemoveFromFavorites(product.product_id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
