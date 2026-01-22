import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/Azios";

export default function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // 🔒 Prevent direct access
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });

      // Check if verification was successful
      if (response.data && response.data.message === "OTP verified successfully") {
        setSuccess("Email verified successfully! Redirecting to login...");
        
        // Store token if provided (optional)
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data?.message || "Verification failed");
      }
      
    } catch (error) {
      // Handle different error responses
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          "Invalid or expired OTP";
      
      setError(errorMessage);
      
      // If too many attempts, suggest resending OTP
      if (error.response?.status === 429) {
        setTimeout(() => {
          if (window.confirm("Would you like to resend a new OTP?")) {
            handleResendOtp();
          }
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.post("/auth/resend-otp", { email });
      
      if (response.data.success) {
        setSuccess("New OTP sent to your email!");
        
        // Clear OTP fields
        setOtp(Array(6).fill(""));
        inputsRef.current[0].focus();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">

        {/* Header */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Verify OTP
        </h1>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit code sent to
          <br />
          <span className="font-semibold text-gray-800 break-all">
            {email}
          </span>
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-bold border rounded-xl 
              focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              hover:border-indigo-400"
              disabled={loading}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 
          hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md
          transition disabled:opacity-50 mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={handleResendOtp}
          disabled={loading}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 
          py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
        >
          Resend OTP
        </button>

        {/* Footer hint */}
        <p className="text-sm text-gray-500 mt-6">
          Check your email inbox and spam folder
        </p>
      </div>
    </div>
  );
}