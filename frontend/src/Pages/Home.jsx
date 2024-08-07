import React, { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 12; // Number of products per page

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // Suggestions for the search bar
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
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
      toast.error("Failed to fetch products.");
    }
  };

  // Define the function to remove a product
  const handleProductRemove = async (productId) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error removing product:", error.message);
        toast.error("Failed to remove product. Please try again.");
      } else {
        toast.success("Product removed successfully.");
        console.log(`Product with ID ${productId} removed successfully.`);

        // Update local state after successful deletion
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing product:", error.message);
      toast.error("Failed to remove product. Please try again.");
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

  const handleOpenModal = (product) => {
    setSelectedProduct(product); // Open modal with selected product
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); // Close modal
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome to My E-commerce Site
      </h1>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 pr-12 border rounded-lg mb-4 focus:outline-none focus:border-blue-500 transition-shadow shadow-sm focus:shadow-lg"
        />
        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.name)}
                className="p-2 cursor-pointer hover:bg-gray-100 transition"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap justify-center mt-4 animate-fade-in">
        {getPaginatedProducts().map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            onRemoveProduct={isAdmin ? handleProductRemove : undefined} // Pass function to remove product
            onOpenModal={handleOpenModal} // Pass function to open modal
          />
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal} // Pass function to close modal
        />
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 transition`}
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
