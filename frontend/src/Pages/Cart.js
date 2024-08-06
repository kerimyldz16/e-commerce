import React from "react";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.js";
import "../Styles/Cart.css";

const Cart = () => {
  const { cartItems, handleRemoveFromCart, handleUpdateQuantity } =
    useCartAndFavorites();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    handleUpdateQuantity(productId, newQuantity);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>
              Quantity:
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value))
                }
              />
            </p>
            <button onClick={() => handleRemoveFromCart(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h2>Total Amount: ${totalAmount.toFixed(2)}</h2>
      <button className="checkout-button">Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
