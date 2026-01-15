import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/Azios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response token:", data.token ? "YES" : "NO");
      
      // ✅ CRITICAL: Pass BOTH user data AND token to login
      login(data.user, data.token);

      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Forgot Password?
          <span
            className="text-blue-600 cursor-pointer ml-1 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Reset
          </span>
        </p>

        <p className="text-sm text-center mt-4">
          Don't have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1 hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}