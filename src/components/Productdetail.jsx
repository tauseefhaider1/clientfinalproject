import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/Azios";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Use only base URL without /api for images
  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://backend-final-project1-production.up.railway.app";

  // Format price for PKR
  const formatPricePKR = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/product/${id}`);
        const data = res.data;

        if (data?.success && data.product) setProduct(data.product);
        else if (data?._id) setProduct(data);
        else if (data?.data) setProduct(data.data);
        else throw new Error("Product data not found");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  // Handle quantity
  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (type === "increase" && product?.stockStatus !== "out")
      setQuantity(quantity + 1);
  };

  // Add to cart - SIMPLIFIED VERSION
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    
    if (!product || product.stockStatus === "out") {
      alert("Out of stock");
      return;
    }

    try {
      console.log("📦 Adding to cart:", {
        productId: product._id,
        quantity: quantity,
        userId: user._id || user.id
      });

      // Simple API call - let axios handle headers
      const response = await api.post("/cart/add", { 
        productId: product._id, 
        quantity: quantity 
      });
      
      console.log("✅ Add to cart response:", response.data);
      alert("Added to cart successfully!");
      
    } catch (error) {
      console.error("❌ Add to cart error:", error);
      
      // Show detailed error
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        if (error.response.status === 401) {
          alert("Please login again.");
          navigate("/login");
        } else if (error.response.status === 400) {
          alert(error.response.data.message || "Invalid request");
        } else if (error.response.status === 500) {
          alert("Server error. Check console for details.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Network error. Check your connection.");
      } else {
        console.error("Request setup error:", error.message);
        alert("Failed to add to cart: " + error.message);
      }
    }
  };

  // Buy now
  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login`, {
        state: { from: `/checkout/${product._id}?qty=${quantity}` },
      });
      return;
    }
    navigate(`/checkout/${product._id}?qty=${quantity}`);
  };

  // Stock status
  const stockText = { in: "In Stock", limited: "Limited Stock", out: "Out of Stock" };
  const stockColor = { in: "text-green-600", limited: "text-yellow-500", out: "text-red-600" };

  // Product image helper - FIXED
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x400?text=No+Image";
    
    // If it's already a full URL, return as is
    if (img.startsWith("http")) return img;
    
    // If it starts with /uploads, prepend BASE_URL
    if (img.startsWith("/")) {
      return `${BASE_URL}${img}`;
    }
    
    // Otherwise, assume it's a relative path
    return `${BASE_URL}/uploads/${img}`;
  };

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading product...</p>
        </div>
      </div>
    );

  // Error state
  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{error || "Product not found"}</h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find this product.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-xl">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl"
            onError={(e) => (e.target.src = "https://via.placeholder.com/400x400?text=No+Image")}
          />
        </div>

        {/* Details - Rest of your JSX remains the same */}
        {/* ... */}
      </div>
      
      {/* Debug button - remove in production */}
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            console.log("Debug info:", {
              product: product,
              user: user,
              token: localStorage.getItem('token'),
              backendUrl: BASE_URL
            });
          }}
          className="px-4 py-2 bg-gray-200 text-sm rounded"
        >
          Debug Info
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;