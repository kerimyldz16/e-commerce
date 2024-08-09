import React, { useState, useEffect } from "react";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import { useCartAndFavorites } from "../context/CartAndFavoritesContext.jsx";
import { supabase } from "../utils/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 15; // her sayfadaki products sayısı

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // search bardaki öneri için state
  const [searchQuery, setSearchQuery] = useState(""); // Search bar'ın querysi için state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürünler için state
  const { handleAddToCart, handleAddToFavorites } = useCartAndFavorites();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData, error } = await supabase
          .from("products")
          .select("*");

        if (error) throw error;

        const shuffledProducts = shuffleArray(productsData); // Shuffle the products array
        setProducts(shuffledProducts);
        setFilteredProducts(shuffledProducts); // başlangıçta bütün productların datasını Filtered setle!
      } catch (error) {
        console.error("Error fetching products:", error.message);
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run only once

  // Custom shuffle function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // ürün silme function'u
  const handleProductRemove = async (productId) => {
    try {
      // ürünü seç
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image")
        .eq("id", productId)
        .single();

      if (fetchError) {
        console.error("Error fetching product details:", fetchError.message);
        toast.error("Failed to fetch product details. Please try again.");
        return;
      }
      // image yolunu urlden ayır
      const imageUrl = product.image;
      const imagePath = imageUrl.replace(
        `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/`,
        ""
      );
      // bucket'dan imageyi sil     //ÇALIŞMIYOR!!!!
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`${imagePath}`]);
      if (deleteImageError) {
        console.error(
          "Error deleting image from bucket:",
          deleteImageError.message
        );
        toast.error("Failed to delete product image. Please try again.");
        return;
      } else {
        console.log("Image deleted successfully.");
      }

      // products table'ından ürünü sil
      const { error: deleteProductError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteProductError) {
        console.error("Error removing product:", deleteProductError.message);
        toast.error("Failed to remove product. Please try again.");
      } else {
        toast.success("Product removed successfully.");
        console.log(`Product with ID ${productId} removed successfully.`);

        // silme başarılıysa state'i güncelle
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (error) {
      console.error("Unexpected error removing product:", error);
      toast.error("Unexpected error removing product.");
    }
  };

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
    setSelectedProduct(product); // product'ın modalini açma
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); // product'ın modalini kapatma
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to ShopGO</h1>

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
            onRemoveProduct={isAdmin ? handleProductRemove : undefined} // user adminse ürün silmek için function
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
        />
      )}

      {/* Pagination Controls */}
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
    </div>
  );
};

export default Home;
