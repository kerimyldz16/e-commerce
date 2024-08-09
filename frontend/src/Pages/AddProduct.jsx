import React, { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";

const AddProduct = () => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "technology",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const { error } = await supabase.storage
      .from("images")
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
      return;
    }

    const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/public/${file.name}`;
    setFormData((prevData) => ({ ...prevData, image: imageUrl }));
    toast.success("Image uploaded successfully.");
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, image, description, category } = formData;

    if (!name || !price || !image || !description || !category) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([{ name, price, image, description, category }]);

      if (error) throw error;

      console.log("Product added:", data);
      toast.success("Product added successfully.");

      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "technology",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  if (!isAdmin) {
    return <div className="text-center text-red-600">Unauthorized Access</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </label>
        <label className="block">
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </label>
        <label className="block">
          Image URL:
          <div className="relative mt-1 w-full">
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={open}
              className="absolute right-0 top-0 mt-2 mr-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FaUpload />
            </button>
          </div>
        </label>
        <label className="block">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </label>
        <label className="block">
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="technology">Technology</option>
            <option value="clothes">Clothes</option>
            <option value="furniture">Furniture</option>
            <option value="sports">Sports</option>
          </select>
        </label>
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Product
        </button>
      </form>
      <div {...getRootProps()} className="hidden">
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default AddProduct;
