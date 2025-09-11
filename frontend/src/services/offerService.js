
const API_URL = "http://localhost:8000/api/offers/";
import axiosInstance from "./axiosInstance";
import axios from "axios";

// Get access token from localStorage
export const getAccessToken = () => localStorage.getItem("access_token");

// Create a new offer
export const createOffer = async (offerData) => {
  const response = await axiosInstance.post(API_URL, offerData);
  return response.data;
};

export const getAllOffers = async () => {
  const response = await axiosInstance.get(API_URL, {
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
  const response = await axios.get(`${API_URL}?user=${userId}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return response.data;
};
