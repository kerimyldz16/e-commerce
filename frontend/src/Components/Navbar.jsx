// src/Components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import "../Styles/Navbar.css";

const Navbar = () => {
  const { currentUser, signOut, userName, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Logo</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/category/technology">Technology</Link>
        </li>
        <li>
          <Link to="/category/clothes">Clothes</Link>
        </li>
        <li>
          <Link to="/category/furniture">Furniture</Link>
        </li>
        <li>
          <Link to="/category/sports">Sports</Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/add-product">Add Product</Link>
          </li>
        )}
      </ul>
      <div className="nav-user">
        <Link to="/cart">
          <FaShoppingCart /> Cart
        </Link>
        <Link to="/favorites">
          <FaHeart /> Favorites
        </Link>
        {currentUser ? (
          <div className="user-menu">
            <button onClick={toggleMenu} className="menu-button">
              {userName} <span className="arrow">&#9660;</span>
            </button>
            {menuOpen && (
              <ul className="dropdown-menu">
                <Link to="/profile" onClick={closeMenu}>
                  Profile
                </Link>
                <Link to="/settings" onClick={closeMenu}>
                  Settings
                </Link>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
