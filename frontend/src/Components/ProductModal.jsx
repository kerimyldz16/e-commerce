import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductModal = ({ product, onClose, onAddToCart, onAddToFavorites }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const handleAddToCartClick = async (e) => {
    e.stopPropagation(); //Butona basınca modal'ın açılmasını engelle!
    if (!currentUser) {
      toast.info("Please login to add items to your cart.");
      navigate("/login");
    } else {
      setCartLoading(true); // art arda basmayı engelle!
      await onAddToCart(product);
      setCartLoading(false); // loading state'i resetle!
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

  // modalı kapatmak için backdrop handle click !
  const handleBackdropClick = (event) => {
    // Ensure className is a string before calling includes
    if (
      typeof event.target.className === "string" &&
      event.target.className.includes("modal-backdrop")
    ) {
      onClose();
    }
  };

  if (!product) return null; // Product yoksa null dön!

  return (
    // Backdrop
    <div
      className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <div className="modal-body flex flex-col md:flex-row">
          <img
            src={product.image}
            alt={product.name}
            className="modal-image w-full md:w-1/3 object-cover"
          />
          <div className="modal-details p-6">
            <h2 className="modal-name text-2xl font-bold mb-4">
              {product.name}
            </h2>
            <p className="modal-description text-gray-700 mb-4">
              {product.description}
            </p>
            <p className="modal-price text-xl text-gray-800 mb-6">
              ${product.price}
            </p>
            <div className="modal-actions flex space-x-4">
              <button
                onClick={handleAddToFavoritesClick}
                disabled={favoritesLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                {favoritesLoading ? (
                  <span className="animate-spin">...</span>
                ) : (
                  <span className="flex items-center space-x-2">
                    Add to Favorites
                  </span>
                )}
              </button>
              <button
                onClick={handleAddToCartClick}
                disabled={cartLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {cartLoading ? (
                  <span className="animate-spin">...</span>
                ) : (
                  <span className="flex items-center space-x-2">
                    Add to Cart
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
