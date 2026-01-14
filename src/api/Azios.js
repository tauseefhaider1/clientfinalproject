import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-final-project1-production.up.railway.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ADD this interceptor to automatically add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ ADD this interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      
      // Don't redirect if already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;