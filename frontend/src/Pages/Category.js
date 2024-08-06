import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.js";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.js";
import productsData from "../utils/products.json";
import "../Styles/Category.css";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();

  useEffect(() => {
    const filteredProducts = productsData.filter(
      (product) => product.category === category
    );
    setProducts(filteredProducts);
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
