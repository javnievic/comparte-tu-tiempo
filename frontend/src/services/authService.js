import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/`, userData);
  return response.data;
};
