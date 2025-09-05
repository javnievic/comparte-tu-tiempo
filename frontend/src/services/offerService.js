import axios from "axios";
const API_URL = "http://localhost:8000/api/offers/";

// Get access token from localStorage
export const getAccessToken = () => localStorage.getItem("access_token");

// Create a new offer
export const createOffer = async (offerData) => {
  const response = await axios.post(API_URL, offerData, {
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`,
      "Accept": "application/json",
    },
  });
  return response.data;
};

export const getAllOffers = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      "Accept": "application/json",
    },
  });
  return response.data;
};