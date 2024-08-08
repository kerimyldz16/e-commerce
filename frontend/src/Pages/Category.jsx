import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 8;

const Category = () => {
  const { category } = useParams(); // url parametrelerinden kategoriyi getir
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    } catch (error) {
      console.error("Error fetching products:", error.message);
      toast.error("Failed to fetch products.");
    }
  }, [category]); // kategoriyi dependency olarak ekle!

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]); // fetchlemeyi dependency olarak ekle!

  // Current page için product fetchle!
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

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
            />
          ))}
        </div>
      )}

      {/* Pagination controlleri! */}
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
    </div>
  );
};

export default Category;
