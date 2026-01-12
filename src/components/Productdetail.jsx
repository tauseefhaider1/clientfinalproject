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
// In ProductDetail.jsx, update the fetch logic:

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      console.log(`Fetching product with ID: ${id}`);
      
      const res = await api.get(`/product/${id}`);
      console.log("Product API response:", res.data);
      
      // Handle response format: {success: true, product: {...}}
      if (res.data && res.data.success && res.data.product) {
        setProduct(res.data.product);
      } 
      // Alternative format: direct product object
      else if (res.data && res.data._id) {
        setProduct(res.data);
      }
      // Alternative format: {data: {...}}
      else if (res.data && res.data.data) {
        setProduct(res.data.data);
      }
      else {
        setError("Product data not found in response");
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchProduct();
  } else {
    setError("No product ID provided");
    setLoading(false);
  }
}, [id]);
   
const formatPricePKR = (price) => {
  if (!price && price !== 0) return "0";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0, // no decimals for PKR, adjust if needed
  }).format(price);
};

  // 🛒 Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.stockStatus === "out") {
      return alert("Product is out of stock");
    }

    // 🔐 AUTH CHECK (NO API CALL)
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    try {
      await api.post("/api/cart/add", {
        productId: product._id,
        quantity,
      });

      alert("Product added to cart");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  // ⚡ Buy now
  const handleBuyNow = () => {
    if (!product) return;
    
    if (product.stockStatus === "out") {
      return alert("Product is out of stock");
    }

    // 🔐 AUTH CHECK
    if (!user) {
      navigate("/login", {
        state: {
          from: `/checkout/${product._id}?qty=${quantity}`,
        },
      });
      return;
    }

    navigate(`/checkout/${product._id}?qty=${quantity}`);
  };

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (type === "increase") setQuantity(quantity + 1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto p-5 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">
            {error || "Product not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          {/* <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Go Back to Products
          </button> */}
        </div>
      </div>
    );
  }

  const stockText = {
    in: "In Stock",
    limited: "Limited Stock",
    out: "Out of Stock",
  };

  const stockColor = {
    in: "text-green-600",
    limited: "text-yellow-500",
    out: "text-red-600",
  };

  // Fix image URL if needed
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4534";
  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`
    : "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <div className="max-w-6xl mx-auto p-5 min-h-screen">
      {/* <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition"
      >
        ← Back to Products
      </button> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-xl">
        {/* Image */}
        <div>
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
            }}
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center gap-3">
  <span className="text-2xl font-bold">{formatPricePKR(product.price)}</span>
  {product.originalPrice && product.originalPrice > product.price && (
    <span className="line-through text-gray-400">
      {formatPricePKR(product.originalPrice)}
    </span>
  )}
</div>


          {product.discount > 0 && (
            <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {product.discount}% OFF
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-yellow-500">
            </span>
            <span className="text-gray-500">
              ({product.reviews || 0} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`font-semibold ${stockColor[product.stockStatus]}`}>
              {stockText[product.stockStatus]}
            </span>
            {product.stockStatus === "limited" && (
              <span className="text-sm text-gray-500">• Hurry, only a few left!</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-4 py-2 border-x min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={product.stockStatus === "out"}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === "out"}
              className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
                product.stockStatus === "out"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stockStatus === "out"}
              className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
                product.stockStatus === "out"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Buy Now
            </button>
          </div>

          {/* Category info */}
          {product.category && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Category:{" "}
                <span className="font-medium">
                  {typeof product.category === 'object' 
                    ? product.category.title || product.category.name 
                    : product.category}
                </span>
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 border-t pt-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium text-lg transition ${
                  activeTab === "description"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 font-medium text-lg transition ${
                  activeTab === "details"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </div>

            <div className="mt-6">
              {activeTab === "description" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Product Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || "No description available for this product."}
                  </p>
                </div>
              )}
              
              {activeTab === "details" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Product Information</h3>
                  <div className="space-y-2">
                    <div className="flex border-b py-2">
                      <span className="w-32 font-medium text-gray-600">Product ID:</span>
                      <span className="font-mono text-sm">{product._id}</span>
                    </div>
                    <div className="flex border-b py-2">
                      <span className="w-32 font-medium text-gray-600">Stock Status:</span>
                      <span className={stockColor[product.stockStatus]}>
                        {stockText[product.stockStatus]}
                      </span>
                    </div>
                    <div className="flex border-b py-2">
                    </div>
                    {product.createdAt && (
                      <div className="flex border-b py-2">
                        <span className="w-32 font-medium text-gray-600">Added:</span>
                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;