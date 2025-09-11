// src/services/axiosInstance.js
import axios from "axios";
import { logoutUser } from "./authService";

const instance = axios.create();

// Token helper functions
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const refreshAccessToken = async () => {
  const response = await axios.post("http://localhost:8000/api/token/refresh/", {
    refresh: getRefreshToken(),
  });
  localStorage.setItem("access_token", response.data.access);
  return response.data.access;
};

// Request interceptor: attach access token to every request
instance.interceptors.request.use((config) => {
  // Only add token if this request is marked as Auth
  if (config.headers["Auth"]) {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    delete config.headers["Auth"]; // clean up the marker
  }
  return config;
});

// Response interceptor: handle expired access token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired, try to refresh it once
    if (error.response?.status === 401 && !originalRequest._retry  &&
      originalRequest.headers["Authorization"]) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (err) {
        // If refresh also fails, logout user
        logoutUser();
        window.location.href = "/"; // redirect to home
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
