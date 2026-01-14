import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/Azios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ CORRECTED checkAuth function
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me"); // Changed from "/auth/check" to "/auth/me"
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTED login function - now accepts email and password
  const login = async (email, password) => {
    try {
      // 1. Make login API call
      const response = await api.post("/auth/login", {
        email,
        password
      });
      
      console.log("Login response:", response.data);
      
      // 2. Store token if received
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // 3. Update axios default headers
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        
        console.log("✅ Token stored in localStorage");
      }
      
      // 4. Get user data (from response or fetch fresh)
      const userData = response.data.user || response.data;
      setUser(userData);
      
      // 5. Refresh auth to ensure consistency
      await checkAuth();
      
      return response.data;
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ UPDATED logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear everything
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login, // Now expects (email, password) and returns Promise
        logout,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);