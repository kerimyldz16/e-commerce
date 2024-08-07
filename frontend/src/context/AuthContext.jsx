// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { adminUserIds } from "../utils/admins";
// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setCurrentUser(user);
        if (user) {
          const { data, error: nameError } = await supabase
            .from("users")
            .select("name")
            .eq("uid", user.id)
            .single();

          if (nameError) {
            console.error("Error fetching user name:", nameError.message);
          } else {
            setUserName(data.name);
          }
        }
      }
      setLoading(false);
    };

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      initializeAuth();
    });

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Save the user's name in the database
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ uid: data.user.id, email, name }]);

    if (insertError) throw insertError;

    return data.user;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Fetch user name
    const { data: userData, error: nameError } = await supabase
      .from("users")
      .select("name")
      .eq("uid", data.user.id)
      .single();

    if (nameError) throw nameError;

    setUserName(userData.name);

    return data.user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
    setUserName("");
  };
  const isAdmin = currentUser && adminUserIds.includes(currentUser.id);

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    userName,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
