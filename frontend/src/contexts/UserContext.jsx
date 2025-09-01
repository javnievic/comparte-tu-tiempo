import React, { createContext, useState, useEffect } from "react";
import { logoutUser } from "../services/authService"; // Import functions from authService

// Create the user context
export const UserContext = createContext();

// User provider component to wrap your app and provide the user state
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Handle logout
  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };


  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
