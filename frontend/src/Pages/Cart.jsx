import React from "react";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { toast } from "react-toastify";

const Cart = () => {
  const { cartItems, handleRemoveFromCart, handleUpdateQuantity } =
    useCartAndFavorites();

  // toplam tutarı hesapla!
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    handleUpdateQuantity(productId, newQuantity);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Cart</h1>
      <ul className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">
            No product added to the cart.
          </p>
        ) : (
          cartItems.map((item) => (
            <li
              key={item.product_id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold">{item.product_name}</h3>
              <p className="text-gray-600">Price: ${item.product_price}</p>
              <p className="mt-2">
                Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product_id,
                      parseInt(e.target.value)
                    )
                  }
                  className="ml-2 p-2 border rounded-lg w-16"
                />
              </p>
              <button
                onClick={() => handleRemoveFromCart(item.product_id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
      <h2 className="text-xl font-bold mt-6 text-center">
        Total Amount: ${totalAmount.toFixed(2)}
      </h2>
      <button className="block mx-auto mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
