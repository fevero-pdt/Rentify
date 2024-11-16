import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002",
  withCredentials: true, // For handling cookies/sessions
});



// Auth
export const registerUser = (userData) => API.post("/users/register", userData);
export const verifyUser = (verificationData) => API.post("/users/verify", verificationData);
export const loginUser = (credentials) => API.post("/users/login", credentials);

// Owner
export const addItem = async (itemData) => {
  return axios.post("http://localhost:5002/items/addItem", itemData, {
    withCredentials: true, // Include cookies for session management
  });
};
export const fetchProfile = async () => {
  return await axios.get("http://localhost:5002/users/profile", { withCredentials: true }); // Update with your backend URL
};
export const deleteItem = async (itemId) => {
  return await axios.delete(`http://localhost:5002/items/${itemId}`, { withCredentials: true }); // Adjust base URL as needed
};
export const approveRent = (approvalData) => API.post("/owner/approve-rent", approvalData);

// Renter
export const rentItem = (rentData) => API.post("/renter/rent-item", rentData);

// Common
export const fetchItems = async () => {
  return await axios.get("http://localhost:5002/items/");
};
export const searchItems = async (query) => {
  return await axios.get(`http://localhost:5002/items/search?query=${query}`, { withCredentials: true });
};
export const checkSession = () => API.get("/session");
export const logoutUser = () => API.post("/logout");
