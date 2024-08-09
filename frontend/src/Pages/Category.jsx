import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import { FaSearch, FaBars } from "react-icons/fa";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();

  const fetchProductsByCategory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category);

      if (error) throw error;

      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      toast.error("Failed to fetch products.");
    }
  }, [category]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

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

    if (query.trim() === "") {
      handleFilterChange();
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredProducts(filtered);
    }

    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    let filtered = products;

    if (minPrice !== "") {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      {/* Search Bar and Filters Button */}
      <div className="flex justify-between items-center mb-4 max-w-lg mx-auto">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:border-blue-500 transition-shadow shadow-sm focus:shadow-lg"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center px-4 py-2 ml-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <FaBars className="mr-2" />
          Filters
        </button>
      </div>

      {/* Filters Menu */}
      {filtersOpen && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleFilterChange}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Apply Filter
              </button>
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          No product found in this category.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center animate-fade-in">
          {getPaginatedProducts().map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 mb-14 space-x-2">
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
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
        />
      )}
    </div>
  );
};

export default Category;
