import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/Azios";

export default function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

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
      alert("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });

      alert("OTP verified successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired OTP");
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
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 
          hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md
          transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Footer hint */}
        <p className="text-sm text-gray-500 mt-6">
          Didn’t receive the code? Check your spam folder
        </p>
      </div>
    </div>
  );
}
