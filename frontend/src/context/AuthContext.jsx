import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { adminUserIds } from "../utils/admins";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      //Oturumun olup olmadığını kontrol et!
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError.message);
          throw sessionError;
        }
        //sessionData.session undefined döndüğünde hata yerine undefined dönmesi için ? kullan!
        const user = sessionData.session?.user;
        //user null veya undefined dönerse Loading false döndür ve fonksiyonu sonlandır!
        if (!user) {
          setLoading(false);
          return;
        }
        //kullanıcıyı güncelle!
        setCurrentUser(user);
        // kullanıcı adını databaseden çek
        const { data: userData, error: nameError } = await supabase
          .from("users")
          .select("name")
          .eq("uid", user.id)
          .single();

        if (nameError) {
          console.error("Error fetching user name:", nameError.message);
          throw nameError;
        }
        // kullanıcı adını güncelle
        setUserName(userData.name);
      } catch (error) {
        console.error("Error initializing auth:", error.message);
      } finally {
        setLoading(false);
      }
    };
    // oturum durumunu dinle, event olursa Auth'u tekrar başlat!
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        initializeAuth();
      }
    );

    initializeAuth();
    // component unmount olduğunda oturum dinleyicisini temizle.
    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!signUpData.user) {
        throw new Error("User sign-up failed.");
      }

      const { error: insertError } = await supabase
        .from("users")
        .insert([{ uid: signUpData.user.id, email, name }]);

      if (insertError) throw insertError;

      return signUpData.user;
    } catch (error) {
      console.error("Sign-up error:", error.message);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data: signInData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      if (!signInData.user) {
        throw new Error("User sign-in failed.");
      }

      const { data: userData, error: nameError } = await supabase
        .from("users")
        .select("name")
        .eq("uid", signInData.user.id)
        .single();

      if (nameError) throw nameError;

      setUserName(userData.name);

      return signInData.user;
    } catch (error) {
      console.error("Sign-in error:", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      setUserName("");
    } catch (error) {
      console.error("Sign-out error:", error.message);
      throw error;
    }
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
