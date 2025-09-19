import React, {useState, useEffect } from "react";
import { logoutUser } from "../services/authService"; // Import functions from authService
import { UserContext } from "./UserContext"; 

// User provider component to wrap the app and provide the user state
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
  return JSON.parse(localStorage.getItem("user")) || null;
});

  // Load user from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

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
