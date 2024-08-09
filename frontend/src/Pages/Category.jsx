import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

const Category = () => {
  const { category } = useParams(); // url parametrelerinden kategoriyi getir
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // search bardaki öneri için state
  const [searchQuery, setSearchQuery] = useState(""); // Search bar'ın querysi için state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();

  // Databaseden kategoriye göre product fetchleme
  const fetchProductsByCategory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category);

      if (error) throw error;

      setProducts(data);
      setFilteredProducts(data); // Tüm ürünleri başlangıçta filtrelenmiş olarak ayarla
    } catch (error) {
      console.error("Error fetching products:", error.message);
      toast.error("Failed to fetch products.");
    }
  }, [category]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  // current page ürünlerini fetchleme
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Search bar query işlemi
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // searchlenen ürünleri filtreleme
    if (query.trim() === "") {
      setFilteredProducts(products); // query boşsa bütün ürünleri fetchle
      setSuggestions([]); // query boşsa önerileri gösterme
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );

      // search barda önerileri getir
      setSuggestions(
        products.filter((product) =>
          product.name.toLowerCase().startsWith(query.toLowerCase())
        )
      );
    }

    setCurrentPage(1); // searchlerken ilk sayfaya resetle
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

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:border-blue-500 transition-shadow shadow-sm focus:shadow-lg"
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
