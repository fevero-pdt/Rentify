import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/bikes';

export const fetchBikes = async () => {
    const response = await fetch(`${API_URL}`);
    return response.json();
};

export const addBike = async (bikeData) => {
    const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bikeData),
    });
    return response;
};

export const deleteBike = async (bikeData) => {
    const response = await fetch(`${API_URL}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bikeData),
    });
    return response;
};

export default API;
