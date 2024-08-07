// src/Components/ProductModal.js
import React from "react";
import "../Styles/ProductModal.css";

const ProductModal = ({ product, onClose }) => {
  // Handle click on the backdrop to close the modal
  const handleBackdropClick = (event) => {
    // Check if the click was on the backdrop (not the modal content)
    if (event.target.className === "modal-backdrop") {
      onClose();
    }
  };

  if (!product) return null; // Return null if no product is selected

  return (
    // Add backdrop with an onClick handler
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-body">
          <img src={product.image} alt={product.name} className="modal-image" />
          <div className="modal-details">
            <h2 className="modal-name">{product.name}</h2>
            <p className="modal-description">{product.description}</p>
            <p className="modal-price">${product.price}</p>
            <div className="modal-actions">
              <button onClick={() => console.log("Add to Favorites")}>
                Add to Favorites
              </button>
              <button onClick={() => console.log("Add to Cart")}>
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
