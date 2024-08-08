import React from "react";
import { FaTimes } from "react-icons/fa";

const ProductModal = ({ product, onClose }) => {
  // modalı kapatmak için backdrop handle click !
  const handleBackdropClick = (event) => {
    // click modalın içinde mi kontrol et!
    if (event.target.className.includes("modal-backdrop")) {
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
                onClick={() => console.log("Add to Favorites")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Add to Favorites
              </button>
              <button
                onClick={() => console.log("Add to Cart")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
