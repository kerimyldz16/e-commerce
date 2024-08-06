// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.js";
import Home from "./Pages/Home.js";
import Category from "./Pages/Category.js";
import Cart from "./Pages/Cart.js";
import Login from "./Components/Auth/Login.js";
import Register from "./Components/Auth/Register.js";
import Favorites from "./Pages/Favorites.js";
import "./Styles/styles.css";
import { handleLogout } from "./context/CartAndFavoritesContext.js";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
