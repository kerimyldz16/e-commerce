// frontend/src/Pages/Category.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { supabase } from "../utils/supabaseClient.js";

const Category = () => {
  const { category } = useParams(); // Get the category from URL params
  const [products, setProducts] = useState([]);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();

  // Fetch products based on category from the database
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
    }
  }, [category]); // Add 'category' as a dependency

  useEffect(() => {
    fetchProductsByCategory(); // Use the callback
  }, [fetchProductsByCategory]); // Add the fetch function as a dependency

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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
