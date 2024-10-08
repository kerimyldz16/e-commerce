import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartAndFavoritesProvider } from "./context/CartAndFavoritesContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartAndFavoritesProvider>
        <App />
      </CartAndFavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
