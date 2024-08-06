import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import "../Styles/Navbar.css";

const Navbar = ({ handleLogout }) => {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
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
        {currentUser ? (
          <div className="user-menu">
            <button onClick={toggleMenu} className="menu-button">
              {currentUser.email}
            </button>
            {menuOpen && (
              <div className="menu-dropdown">
                <Link to="/profile" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/settings" onClick={toggleMenu}>
                  Settings
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
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
