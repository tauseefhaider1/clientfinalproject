// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import api from "../api/Azios";
// import { useAuth } from "../context/AuthContext";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("description");

//   const BACKEND_URL =
//     import.meta.env.VITE_BACKEND_URL ||
//     "https://backend-final-project1-production.up.railway.app"; // production fallback

//   // Format price for PKR
//   const formatPricePKR = (price) =>
//     new Intl.NumberFormat("en-PK", {
//       style: "currency",
//       currency: "PKR",
//       maximumFractionDigits: 0,
//     }).format(price || 0);

//   // Fetch product
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await api.get(`/product/${id}`);
//         const data = res.data;

//         if (data?.success && data.product) setProduct(data.product);
//         else if (data?._id) setProduct(data);
//         else if (data?.data) setProduct(data.data);
//         else throw new Error("Product data not found");
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProduct();
//     else {
//       setError("No product ID provided");
//       setLoading(false);
//     }
//   }, [id]);

//   // Handle quantity
//   const handleQuantityChange = (type) => {
//     if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
//     if (type === "increase" && product?.stockStatus !== "out")
//       setQuantity(quantity + 1);
//   };

//   // Add to cart
//   const handleAddToCart = async () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (!product || product.stockStatus === "out") return alert("Out of stock");

//     try {
//       await api.post("/cart/add", { productId: product._id, quantity });
//       alert("Added to cart");
//     } catch {
//       alert("Failed to add to cart");
//     }
//   };

//   // Buy now
//   const handleBuyNow = () => {
//     if (!user) {
//       navigate(`/login`, {
//         state: { from: `/checkout/${product._id}?qty=${quantity}` },
//       });
//       return;
//     }
//     navigate(`/checkout/${product._id}?qty=${quantity}`);
//   };

//   // Stock status
//   const stockText = { in: "In Stock", limited: "Limited Stock", out: "Out of Stock" };
//   const stockColor = { in: "text-green-600", limited: "text-yellow-500", out: "text-red-600" };

//   // Product image helper
//   const getImageUrl = (img) => {
//     if (!img) return "https://via.placeholder.com/400x400?text=No+Image";
//     return img.startsWith("http") ? img : `${BACKEND_URL}${img}`;
//   };

//   // Loading state
//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-lg">Loading product...</p>
//         </div>
//       </div>
//     );

//   // Error state
//   if (error || !product)
//     return (
//       <div className="min-h-screen flex items-center justify-center p-5">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-4">{error || "Product not found"}</h2>
//           <p className="text-gray-600 mb-6">
//             Sorry, we couldn't find this product.
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             ← Go Back
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="max-w-6xl mx-auto p-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-xl">
//         {/* Image */}
//         <div className="flex justify-center">
//           <img
//             src={getImageUrl(product.image)}
//             alt={product.name}
//             className="w-full h-96 object-cover rounded-xl"
//             onError={(e) => (e.target.src = "https://via.placeholder.com/400x400?text=No+Image")}
//           />
//         </div>

//         {/* Details */}
//         <div className="space-y-5">
//           <h1 className="text-3xl font-bold">{product.name}</h1>

//           <div className="flex items-center gap-3">
//             <span className="text-2xl font-bold">{formatPricePKR(product.price)}</span>
//             {product.originalPrice > product.price && (
//               <span className="line-through text-gray-400">
//                 {formatPricePKR(product.originalPrice)}
//               </span>
//             )}
//           </div>

//           {product.discount > 0 && (
//             <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
//               {product.discount}% OFF
//             </div>
//           )}

//           <div className="flex items-center gap-2">
//             <span className={`font-semibold ${stockColor[product.stockStatus]}`}>
//               {stockText[product.stockStatus]}
//             </span>
//             {product.stockStatus === "limited" && (
//               <span className="text-sm text-gray-500">• Hurry, only a few left!</span>
//             )}
//           </div>

//           {/* Quantity */}
//           <div className="flex items-center gap-4 mt-4">
//             <span className="font-medium">Quantity:</span>
//             <div className="flex items-center border rounded-lg">
//               <button
//                 onClick={() => handleQuantityChange("decrease")}
//                 className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
//                 disabled={quantity <= 1}
//               >
//                 −
//               </button>
//               <span className="px-4 py-2 border-x min-w-[40px] text-center">{quantity}</span>
//               <button
//                 onClick={() => handleQuantityChange("increase")}
//                 className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
//                 disabled={product.stockStatus === "out"}
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <button
//               onClick={handleAddToCart}
//               disabled={product.stockStatus === "out"}
//               className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
//                 product.stockStatus === "out" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleBuyNow}
//               disabled={product.stockStatus === "out"}
//               className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
//                 product.stockStatus === "out" ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
//               }`}
//             >
//               Buy Now
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex border-b">
//               <button
//                 className={`px-4 py-2 font-medium text-lg transition ${
//                   activeTab === "description"
//                     ? "border-b-2 border-blue-600 text-blue-600"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//                 onClick={() => setActiveTab("description")}
//               >
//                 Description
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium text-lg transition ${
//                   activeTab === "details"
//                     ? "border-b-2 border-blue-600 text-blue-600"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//                 onClick={() => setActiveTab("details")}
//               >
//                 Details
//               </button>
//             </div>

//             <div className="mt-6">
//               {activeTab === "description" && (
//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                     {product.description || "No description available."}
//                   </p>
//                 </div>
//               )}
//               {activeTab === "details" && (
//                 <div className="p-4 bg-gray-50 rounded-lg space-y-2">
//                   <div className="flex justify-between border-b py-2">
//                     <span className="font-medium text-gray-600">Product ID:</span>
//                     <span className="font-mono text-sm">{product._id}</span>
//                   </div>
//                   <div className="flex justify-between border-b py-2">
//                     <span className="font-medium text-gray-600">Stock Status:</span>
//                     <span className={stockColor[product.stockStatus]}>{stockText[product.stockStatus]}</span>
//                   </div>
//                   {product.createdAt && (
//                     <div className="flex justify-between border-b py-2">
//                       <span className="font-medium text-gray-600">Added:</span>
//                       <span>{new Date(product.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
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

        {/* Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{formatPricePKR(product.price)}</span>
            {product.originalPrice > product.price && (
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
              <span className="px-4 py-2 border-x min-w-[40px] text-center">{quantity}</span>
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
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === "out"}
              className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
                product.stockStatus === "out" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stockStatus === "out"}
              className={`flex-1 py-3 rounded-xl text-white font-medium transition ${
                product.stockStatus === "out" ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Buy Now
            </button>
          </div>

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
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || "No description available."}
                  </p>
                </div>
              )}
              {activeTab === "details" && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between border-b py-2">
                    <span className="font-medium text-gray-600">Product ID:</span>
                    <span className="font-mono text-sm">{product._id}</span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="font-medium text-gray-600">Stock Status:</span>
                    <span className={stockColor[product.stockStatus]}>{stockText[product.stockStatus]}</span>
                  </div>
                  {product.createdAt && (
                    <div className="flex justify-between border-b py-2">
                      <span className="font-medium text-gray-600">Added:</span>
                      <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
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