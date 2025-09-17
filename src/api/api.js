import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL.replace(/\/+$/, ""), // ✅ remove trailing slashes
});

// ✅ Interceptor to attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
