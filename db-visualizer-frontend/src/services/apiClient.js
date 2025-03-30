import axios from "axios";

// Base URL
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://192.168.0.104:5001/api/";

// Secret key for identifying frontend origin
const SECRET_KEY =
  process.env.REACT_APP_API_SECRET || "db-visualizer-client-key";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": SECRET_KEY,
  },
});

// Optional: Add auth token interceptor (future)
apiClient.interceptors.request.use((config) => {
  // Add auth token here if needed
  return config;
});

export const apiGet = (url, config = {}) => apiClient.get(url, config);
export const apiPost = (url, data, config = {}) =>
  apiClient.post(url, data, config);
export const apiPut = (url, data, config = {}) =>
  apiClient.put(url, data, config);
export const apiDelete = (url, config = {}) => apiClient.delete(url, config);
export const apiPatch = (url, data, config = {}) =>
  apiClient.patch(url, data, config);
