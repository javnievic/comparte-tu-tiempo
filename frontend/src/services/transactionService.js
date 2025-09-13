import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8000/api/transactions/";

// Private routes - requires Auth header
export const createTransaction = async (data) => {
  const response = await axiosInstance.post(`${API_URL}`, data, {
    headers: { "Auth": true, "Accept": "application/json" },
  });
  return response.data;
};

