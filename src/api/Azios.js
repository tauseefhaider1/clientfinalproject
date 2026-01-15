import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-final-project1-production.up.railway.app/api",
  withCredentials: true, // ✅ MUST HAVE for cookies
});

// ✅ Add request interceptor to ensure cookies are sent
api.interceptors.request.use(
  (config) => {
    console.log(`🍪 Sending ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("🛑 401 Unauthorized - Session expired");
      
      // Clear user data
      localStorage.removeItem("user");
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;