import React, { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard.js";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.js";
import productsData from "../utils/products.json";
import "../Styles/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();

  useEffect(() => {
    setProducts(productsData);
  }, []);

  return (
    <div className="home">
      <h1>Welcome to My E-commerce Site</h1>
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

export default Home;
