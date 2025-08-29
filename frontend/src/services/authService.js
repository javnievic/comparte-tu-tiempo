import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/`, userData);
  return response.data;
};
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login/`, credentials);
  return response.data;
};
