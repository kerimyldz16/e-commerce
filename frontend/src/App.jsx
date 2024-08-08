import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Home from "./Pages/Home.jsx";
import Category from "./Pages/Category.jsx";
import Cart from "./Pages/Cart.jsx";
import Login from "./Components/Auth/Login.jsx";
import Register from "./Components/Auth/Register.jsx";
import AddProduct from "./Pages/AddProduct.jsx";
import Favorites from "./Pages/Favorites.jsx";
import "./Styles/styles.css";

// footer'ı şartlı render için custom component oluşturma
const AppContent = () => {
  const location = useLocation(); // güncel lokasyonu tespit etme

  return (
    <div className="flex-grow relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        <AppContent />
        <ToastContainer position="bottom-right" autoClose={3000} />{" "}
      </div>
    </Router>
  );
};

export default App;
