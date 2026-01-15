import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/Azios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log("🔐 Checking auth status...");
      
      const res = await api.get("/auth/me");
      
      if (res.data.success && res.data.user) {
        console.log("✅ User authenticated:", res.data.user.email);
        setUser(res.data.user);
        
        // Store user in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        console.warn("⚠️ No active session");
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("❌ Auth check failed:", {
        status: err.response?.status,
        message: err.response?.data?.message
      });
      
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log("🔐 Login success, setting user:", userData.email);
    setUser(userData);
    
    // Store in localStorage
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    
    // Verify the session is active
    setTimeout(() => checkAuth(), 500);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout API failed:", err.message);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      console.log("✅ User logged out");
    }
  };

  // Check auth on mount
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