// src/services/userService.js
import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8000/api/users/";

// Get access token from localStorage
export const getAccessToken = () => localStorage.getItem("access_token");

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}${id}/`, {
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

export const getAllUsers = async () => {
    const response = await axiosInstance.get(`${API_URL}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
};

// Private routes - requires Auth header
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`${API_URL}${id}/`, userData, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "multipart/form-data",
      "Auth": true,
    },
  });
  return response.data;
};
