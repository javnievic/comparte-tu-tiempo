// src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/users/";

// Get access token from localStorage
export const getAccessToken = () => localStorage.getItem("access_token");

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
