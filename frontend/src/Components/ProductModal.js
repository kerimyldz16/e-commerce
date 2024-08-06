import React from "react";
import "../Styles/ProductModal.css";

const ProductModal = ({ product, onClose }) => {
  return (
    <div className="modal">
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
                Favorilere Ekle
              </button>
              <button onClick={() => console.log("Add to Cart")}>
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
