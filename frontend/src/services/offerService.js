
const API_URL = "http://localhost:8000/api/offers/";
import axiosInstance from "./axiosInstance";

// Get access token from localStorage
export const getAccessToken = () => localStorage.getItem("access_token");


// Public routes 

export const getAllOffers = async (query = "") => {
  const response = await axiosInstance.get(`${API_URL}${query}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return response.data;
};


export const getOfferById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}${id}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return response.data;
};

export const getOffersByUser = async (userId) => {
  const response = await axiosInstance.get(`${API_URL}?user=${userId}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return response.data;
};

// Private routes - requires Auth header
export const createOffer = async (offerData) => {
  const response = await axiosInstance.post(API_URL, offerData, {
    headers: {
      "Auth": true,
    },
  });
  return response.data;
};

export const updateOffer = async (id, offerData) => {
  const response = await axiosInstance.put(`${API_URL}${id}/`, offerData, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "multipart/form-data",
      "Auth": true,
    },
  });
  return response.data;
};

export const deleteOffer = async (offerId) => {
  const response = await axiosInstance.delete(`${API_URL}${offerId}/`, {
    headers: {
      "Auth": true,
    },
  });
  return response.data;
};