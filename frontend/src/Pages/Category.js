import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.js";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.js";
import "../Styles/Category.css";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();

  useEffect(() => {
    // Fetch products from the backend based on category
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        const filteredProducts = data.filter(
          (product) => product.category === category
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  return (
    <div className="category-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
