import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaHeart, FaCartPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

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
    e.stopPropagation();
    if (!currentUser) {
      toast.info("Please login to add items to your cart.");
      navigate("/login");
    } else {
      setCartLoading(true);
      await onAddToCart(product);
      setCartLoading(false);
    }
  };

  const handleAddToFavoritesClick = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.info("Please login to add items to your favorites.");
      navigate("/login");
    } else {
      setFavoritesLoading(true);
      await onAddToFavorites(product);
      setFavoritesLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full sm:w-60 m-4 cursor-pointer"
      onClick={() => onOpenModal(product)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="flex flex-col justify-between flex-grow p-4">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold hover:text-blue-500 transition break-words">
            {product.name}
          </h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
        <div className="flex justify-between items-center space-x-2 mt-4">
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
