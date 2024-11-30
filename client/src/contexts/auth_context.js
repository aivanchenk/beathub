import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this is imported correctly

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null); // New state for user ID

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (!isTokenExpired) {
          setIsLoggedIn(true);
          setUserRole(decodedToken.user.role);
          setUserId(decodedToken.user.id); // Set user ID from token
          console.log(decodedToken.user.id);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logIn = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (!isTokenExpired) {
        setIsLoggedIn(true);
        setUserRole(decodedToken.user.role);
        setUserId(decodedToken.user.id); // Set user ID from token
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
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
