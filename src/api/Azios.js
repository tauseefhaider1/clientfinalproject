import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-final-project1-production.up.railway.app/api",
  // ❌ Remove withCredentials: true - we're using JWT tokens
});

// ✅ ADD THIS: Token interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    console.log(`🔐 Request to ${config.url} - Token:`, token ? "Present" : "Missing");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ ADD THIS: Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🛑 401 Unauthorized - Clearing token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;