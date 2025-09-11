import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8000/api";

export const registerUser = async (userData) => {
  const response = await axiosInstance.post(`${API_URL}/users/`, userData);

    if (response.status === 201) {
      const loginResponse = await axiosInstance.post(`${API_URL}/login/`, {
        email: userData.get("email") || userData.email,
        password: userData.get("password") || userData.password
      });

      localStorage.setItem("access_token", loginResponse.data.access);
      localStorage.setItem("refresh_token", loginResponse.data.refresh);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
    }
    
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(`${API_URL}/login/`, credentials);

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
