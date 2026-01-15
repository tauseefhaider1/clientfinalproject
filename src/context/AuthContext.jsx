import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/Azios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("🔐 No token found");
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Test the token
      const res = await api.get("/auth/me");
      
      if (res.data.success) {
        console.log("✅ User authenticated:", res.data.user?.email);
        setUser(res.data.user);
      } else {
        console.warn("⚠️ Auth failed, clearing token");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Auth check error:", err.response?.status);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    console.log("🔐 Login with token:", token ? "Token received" : "No token");
    
    if (token) {
      localStorage.setItem("token", token);
    }
    
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    
    // Verify auth after login
    setTimeout(() => checkAuth(), 100);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout API failed:", err.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.log("✅ User logged out");
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
        login,
        logout,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);