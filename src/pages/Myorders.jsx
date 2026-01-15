import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/Azios";
import { useAuth } from "../context/AuthContext";

// 🛠️ Helper: Get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.trim() === "") return null;
  
  // Already a full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Handle relative paths
  const backendUrl = "https://backend-final-project1-production.up.railway.app";
  
  if (imagePath.startsWith("/uploads/")) {
    return `${backendUrl}${imagePath}`;
  }
  
  if (imagePath.startsWith("uploads/")) {
    return `${backendUrl}/${imagePath}`;
  }
  
  // Default: assume it's in uploads/products
  return `${backendUrl}/uploads/products/${imagePath}`;
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Show success message when redirected from checkout
  useEffect(() => {
    if (location.state?.orderCreated && location.state?.orderId) {
      alert(`✅ Order #${location.state.orderId} placed successfully!`);
      // Clear state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my", { withCredentials: true });
        
        if (res.data.success) {
          // ✅ Process orders to ensure correct data structure
          const processedOrders = (res.data.orders || []).map(order => ({
            ...order,
            items: (order.items || []).map(item => ({
              ...item,
              // Ensure name field exists (it might be stored as 'name' or 'title')
              name: item.name || item.title || item.product?.name || "Product",
              // Get image with full URL
              image: getImageUrl(item.image || item.product?.image),
              price: item.price || item.product?.price || 0,
              quantity: item.quantity || 1
            }))
          }));
          
          setOrders(processedOrders);
          setError("");
        } else {
          setError(res.data.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Orders fetch error:", err);
        setError(
          err.response?.data?.message || 
          "Failed to load orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please login to view orders");
    }
  }, [user]);

  // Filter orders by status
  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => 
        order.orderStatus?.toLowerCase() === filter.toLowerCase()
      );

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    
    switch(statusLower) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": 
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": 
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your orders</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-blue-100">
                {orders.length} order{orders.length !== 1 ? "s" : ""} in total
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-4 md:mt-0 px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <div className="text-red-800">{error}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "pending" 
                  ? "bg-yellow-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "processing" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("shipped")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "shipped" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter("delivered")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "delivered" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {filter === "all" ? "No Orders Yet" : `No ${filter} Orders`}
            </h2>
            <p className="text-gray-500 mb-6">
              {filter === "all" 
                ? "You haven't placed any orders yet. Start shopping!" 
                : `You don't have any ${filter} orders.`
              }
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Order #{order._id?.substring(0, 8).toUpperCase() || "N/A"}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-2xl font-bold text-blue-700">
                        ₹{order.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-700 mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {order.items?.map((item, index) => {
                      const itemName = item.name || "Product";
                      const itemPrice = item.price || 0;
                      const itemImage = item.image;
                      const itemQuantity = item.quantity || 1;
                      const itemTotal = (itemPrice * itemQuantity).toFixed(2);

                      return (
                        <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                          <div className="flex items-center space-x-4">
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {itemImage ? (
                                <img 
                                  src={itemImage}
                                  alt={itemName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Hide broken image and show fallback
                                    e.target.style.display = "none";
                                    const parent = e.target.parentElement;
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center bg-gray-300">
                                        <span class="text-gray-500 text-xs">No Image</span>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                  <span className="text-gray-500 text-xs">No Image</span>
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div>
                              <p className="font-medium text-gray-800">{itemName}</p>
                              <p className="text-sm text-gray-500">
                                ₹{itemPrice.toFixed(2)} × {itemQuantity}
                              </p>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div>
                            <p className="font-semibold text-gray-800">
                              ₹{itemTotal}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 p-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Shipping Address</h5>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.fullName || "N/A"}<br />
                          {order.shippingAddress.address || "N/A"}<br />
                          {order.shippingAddress.city || ""} {order.shippingAddress.postalCode || ""}<br />
                          Phone: {order.shippingAddress.phone || "N/A"}
                        </p>
                      </div>
                    )}

                    {/* Payment Info */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Payment</h5>
                      <p className="text-sm text-gray-600">
                        Method: <span className="font-medium">{order.paymentMethod?.toUpperCase() || "COD"}</span><br />
                        Status: <span className={`px-2 py-1 rounded text-xs ${
                          order.paymentStatus === "paid" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.paymentStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="md:text-right">
                      <div className="space-x-3">
                        <button
                          onClick={() => alert(`Tracking not available for order #${order._id}`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                        >
                          Track Order
                        </button>
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition"
                        >
                          View Details
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Order ID: {order._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{orders
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.orderStatus?.toLowerCase() === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderStatus?.toLowerCase() === "delivered").length}
              </p>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-bold text-lg text-gray-800 mb-2">Need help with your order?</h3>
          <p className="text-gray-600 mb-4">
            Contact our customer support for order-related queries.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => alert("Chat support feature coming soon!")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Chat with Support
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}