// src/Pages/Home.js
import React, { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard.js";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.js";
import { supabase } from "../utils/supabaseClient.js";
import { useAuth } from "../context/AuthContext.js";
import "../Styles/Home.css";

const ITEMS_PER_PAGE = 12; // Number of products per page

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // Suggestions for the search bar
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentPage, setCurrentPage] = useState(1);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      const { data: productsData, error } = await supabase
        .from("products")
        .select("*");

      if (error) throw error;

      setProducts(productsData);
      setFilteredProducts(productsData); // Set filtered products initially to all products
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const handleProductRemove = async (productId) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      alert("Product removed successfully.");
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error removing product:", error.message);
      alert("Failed to remove product. Please try again.");
    }
  };

  // Get products for the current page
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products based on the search query
    if (query.trim() === "") {
      setFilteredProducts(products); // Show all products if query is empty
      setSuggestions([]); // Clear suggestions if query is empty
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );

      // Generate suggestions for the search bar
      setSuggestions(
        products.filter((product) =>
          product.name.toLowerCase().startsWith(query.toLowerCase())
        )
      );
    }

    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(suggestion.toLowerCase())
      )
    );
    setSuggestions([]);
  };

  return (
    <div className="home">
      <h1>Welcome to My E-commerce Site</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.name)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}

      <div className="product-list">
        {getPaginatedProducts().map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            onRemove={isAdmin ? () => handleProductRemove(product.id) : null}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
