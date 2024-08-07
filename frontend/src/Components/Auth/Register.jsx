import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { supabase } from "../../utils/supabaseClient.js";
import "../../Styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for name
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign up the user
      const user = await signUp(email, password);

      console.log("Registered:", user);

      // Store user name in the database
      const { error } = await supabase.from("users").insert([
        {
          uid: user.id, // Use the Supabase user ID
          email: user.email,
          name,
        },
      ]);

      if (error) {
        throw error;
      }

      alert("You registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error registering:", error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
