import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002",
  withCredentials: true, // For handling cookies/sessions
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (userData) => API.post("/users/register", userData);
export const verifyUser = (verificationData) => API.post("/users/verify", verificationData);
export const loginUser = (credentials) => API.post("/users/login", credentials);

// Forgot Password and Reset Password
export const forgotPassword = async (email) => {
  return await axios.post("http://localhost:5002/users/forgot-password", { email });
};

export const resetPassword = async (resetData) => {
  return await axios.post("http://localhost:5002/users/reset-password", resetData);
};

// Delete User
export const deleteAdminUser = async (userId, data) => {
  return await API.put(`/admin/users/${userId}/delete`, data, { withCredentials: true });
};

export const deleteAdminItem = async (itemId) => {
  return await API.delete(`/admin/items/${itemId}`);
};
export const addAdminUser = async (userData) => {
  return await axios.post("http://localhost:5002/admin/add-users", userData, {
    withCredentials: true,
  });
};

export const addAdminItem = async (itemData) => {
  return await axios.post("http://localhost:5002/admin/add-items", itemData, {
    withCredentials: true,
  });
};

// Owner
export const addItem = async (formData) => {

  try {
    // Send the FormData to the backend
    const response = await axios.post("http://localhost:5002/items/addItem", formData, {
      withCredentials: true, // Include cookies for session management
    });

    return response; // Return response for further handling in the component
  } catch (error) {
    console.error("Error adding item:", error);
    throw error; // Rethrow to handle error in component
  }
};


export const fetchProfile = async () => {
  return await axios.get("http://localhost:5002/users/profile", { withCredentials: true });
};

export const deleteItem = async (itemId) => {
  return await axios.delete(`http://localhost:5002/items/${itemId}`, { withCredentials: true });
};

export const fetchRequests = async (itemId) => {
  return await axios.get(`http://localhost:5002/items/${itemId}/requests`, { withCredentials: true });
};

// Renter
export const returnItem = async (itemId) => {
  return await API.post(`/items/${itemId}/return`);
};

// Common
export const fetchItems = async () => {
  return await axios.get("http://localhost:5002/items/");
};

export const searchItems = async (query) => {
  return await axios.get(`http://localhost:5002/items/search?query=${query}`, { withCredentials: true });
};

export const updatePassword = async (passwordForm) => {
  const response = await axios.put(
    "http://localhost:5002/users/update-password",
    passwordForm,
    { withCredentials: true }
  );
  return response.data;
};

export const checkSession = () => API.get("/session");
export const logoutUser = () => API.post("/logout");
