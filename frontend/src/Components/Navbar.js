// src/Components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import "../Styles/Navbar.css";

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error.message);
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
      </ul>
      <div className="nav-user">
        <Link to="/cart">
          <FaShoppingCart /> Cart
        </Link>
        <Link to="/favorites">
          <FaHeart /> Favorites
        </Link>
        <div className="user-menu">
          <button onClick={toggleMenu} className="menu-button">
            {currentUser ? currentUser.name || "Guest" : "Guest"}
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={toggleMenu}>
                    Profile
                  </Link>
                  <Link to="/settings" onClick={toggleMenu}>
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={toggleMenu}>
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
