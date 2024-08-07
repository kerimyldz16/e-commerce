import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaHeart, FaCartPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToFavorites,
  onRemoveProduct,
  onOpenModal,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const handleAddToCartClick = async (e) => {
    e.stopPropagation(); // Prevent the modal from opening when clicking on the button
    if (!currentUser) {
      alert("Please Login");
      navigate("/login");
    } else {
      setCartLoading(true); // Set loading to true when adding to cart
      await onAddToCart(product);
      setCartLoading(false); // Reset loading state
    }
  };

  const handleAddToFavoritesClick = async (e) => {
    e.stopPropagation(); // Prevent the modal from opening when clicking on the button
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
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full sm:w-60 m-4 cursor-pointer"
      onClick={() => onOpenModal(product)} // Open the modal on card click
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3
          className="text-lg font-semibold hover:text-blue-500 transition"
          onClick={handleProductNameClick}
        >
          {product.name}
        </h3>
        <p className="text-gray-600">${product.price}</p>
        <div className="mt-4 flex justify-between items-center space-x-2">
          <button
            onClick={handleAddToCartClick}
            disabled={cartLoading}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
          >
            {cartLoading ? (
              <span className="animate-spin">...</span>
            ) : (
              <span className="flex items-center space-x-2">
                <FaCartPlus />
              </span>
            )}
          </button>
          <button
            onClick={handleAddToFavoritesClick}
            disabled={favoritesLoading}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
          >
            {favoritesLoading ? (
              <span className="animate-spin">...</span>
            ) : (
              <span className="flex items-center space-x-2">
                <FaHeart />
              </span>
            )}
          </button>
          {isAdmin && onRemoveProduct && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRemoveProduct) onRemoveProduct(product.id);
              }}
              className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition w-full"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
