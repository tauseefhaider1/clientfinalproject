import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-final-project1-production.up.railway.app/api",
  // REMOVE withCredentials: true
});

// ✅ Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;