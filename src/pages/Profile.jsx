import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Azios"
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        // ✅ Use correct endpoint based on your backend
        const response = await api.get("/api/auth/me");
        console.log("Profile response:", response.data);
        
        // ✅ FIXED: Check for authenticated instead of success
        if (response.data.authenticated && response.data.user) {
          setUserData(response.data.user);
        } else {
          setError(response.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile");
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn, navigate]);
const handleAvatarUpload = async () => {
  if (!avatar) return;

  try {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const res = await api.put("/auth/profile/avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // ✅ FIX: Check for success and use user data
    if (res.data.success && res.data.user) {
      setUserData(prev => ({
        ...prev,
        ...res.data.user
      }));
      setAvatar(null); // Clear selected file
      alert(res.data.message || "Profile picture updated!");
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert(error.response?.data?.message || "Failed to upload picture");
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={userData.avatar || "/user.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            
            <div className="mt-4 space-y-3">
              <input 
                type="file" 
                onChange={e => setAvatar(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
              <button 
                onClick={handleAvatarUpload}
                disabled={!avatar}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Upload Picture
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-500 mb-2">Name</h2>
              <p className="text-xl font-semibold">{userData.name || "No name set"}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-500 mb-2">Email</h2>
              <p className="text-xl font-semibold">{userData.email || "No email"}</p>
            </div>
            
            {userData.role && (
              <div>
                <h2 className="text-lg font-medium text-gray-500 mb-2">Account Type</h2>
                <p className="text-xl font-semibold capitalize">{userData.role}</p>
              </div>
            )}
            
            {userData.createdAt && (
              <div>
                <h2 className="text-lg font-medium text-gray-500 mb-2">Member Since</h2>
                <p className="text-xl font-semibold">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
            <div className="flex flex-wrap gap-4">
              {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Edit Profile
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                Change Password
              </button> */}
              <button 
  onClick={() => navigate("/my-orders")}
  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
>
  Order History
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}