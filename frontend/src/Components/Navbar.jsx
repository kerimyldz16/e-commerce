import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { FaShoppingCart, FaHeart, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const { currentUser, signOut, userName, isAdmin } = useAuth();
  const { cartItems } = useCartAndFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      closeMenu();
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const getLinkClass = (path) =>
    location.pathname === path
      ? " text-blue-500"
      : "hover:text-gray-300 transition";

  // carttaki productların sayısını hesapla
  const cartItemCount = cartItems.length;

  return (
    <nav className="bg-gray-800 text-white p-1 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300 transition">
            <img className="h-24 w-24" src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/category/technology"
            className={getLinkClass("/category/technology")}
          >
            Technology
          </Link>
          <Link
            to="/category/clothes"
            className={getLinkClass("/category/clothes")}
          >
            Clothes
          </Link>
          <Link
            to="/category/furniture"
            className={getLinkClass("/category/furniture")}
          >
            Furniture
          </Link>
          <Link
            to="/category/sports"
            className={getLinkClass("/category/sports")}
          >
            Sports
          </Link>
          {isAdmin && (
            <Link to="/add-product" className={getLinkClass("/add-product")}>
              Add Product
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4 px-4 mr-8">
          <div className="relative">
            <Link
              to="/cart"
              className={`flex items-center ${getLinkClass("/cart")} gap-1.5`}
            >
              <FaShoppingCart /> Cart
            </Link>
            {cartItemCount > 0 && (
              <span className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <Link
            to="/favorites"
            className={`flex items-center ${getLinkClass(
              "/favorites"
            )} gap-1.5`}
          >
            <FaHeart /> Favorites
          </Link>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-2 hover:text-gray-300 transition gap-1.5"
              >
                <FaUserCircle />
                {userName}
              </button>
              {menuOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-lg z-50">
                  <li>
                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      onClick={closeMenu}
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition "
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 hover:text-gray-300 transition gap-1.5"
            >
              <FaUserCircle /> Login
            </Link>
          )}
        </div>
        <button onClick={toggleMenu} className="md:hidden block text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden block bg-gray-800 p-2">
          <Link
            to="/category/technology"
            className={`block px-4 py-2 ${getLinkClass(
              "/category/technology"
            )}`}
          >
            Technology
          </Link>
          <Link
            to="/category/clothes"
            className={`block px-4 py-2 ${getLinkClass("/category/clothes")}`}
          >
            Clothes
          </Link>
          <Link
            to="/category/furniture"
            className={`block px-4 py-2 ${getLinkClass("/category/furniture")}`}
          >
            Furniture
          </Link>
          <Link
            to="/category/sports"
            className={`block px-4 py-2 ${getLinkClass("/category/sports")}`}
          >
            Sports
          </Link>
          {isAdmin && (
            <Link
              to="/add-product"
              className={`block px-4 py-2 ${getLinkClass("/add-product")}`}
            >
              Add Product
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
