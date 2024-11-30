import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await logIn(token);
      }
    };

    initializeAuth();
  }, []);

  const logIn = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/role",
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setIsLoggedIn(true);
      setUserRole(response.data.role);
      setUserId(response.data.id);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Failed to validate token:", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserRole(null);
      setUserId(null);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null); // Clear user ID
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, userId, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
