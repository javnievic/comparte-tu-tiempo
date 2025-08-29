import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/`, userData);

    if (response.status === 201) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login/`, credentials);

  if (response.status === 200) {
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};


// Obtain access token function
export const getAccessToken = () => localStorage.getItem("access_token");

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};
