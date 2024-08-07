// src/Pages/AddProduct.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import "../Styles/AddProduct.css";

const AddProduct = () => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "technology", // Default category
  });

  if (!isAdmin) {
    return <div>Unauthorized Access</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, image, description, category } = formData;

    if (!name || !price || !image || !description || !category) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .insert([{ name, price, image, description, category }]);

      if (error) throw error;

      alert("Product added successfully.");
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "technology",
      });
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="technology">Technology</option>
            <option value="clothes">Clothes</option>
            <option value="furniture">Furniture</option>
            <option value="sports">Sports</option>
          </select>
        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
