// src/services/axiosInstance.js
import axios from "axios";

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
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle expired access token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired, try to refresh it once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return instance(originalRequest); // retry the original request
    }

    return Promise.reject(error);
  }
);

export default instance;
