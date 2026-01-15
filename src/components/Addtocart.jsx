import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Azios.js";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [cart, setCart] = useState({ items: [], cartTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  // 🔄 Fetch cart and FILTER NULL PRODUCTS
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart", { withCredentials: true });
        console.log("Cart API response:", res.data);
        
        // FILTER OUT NULL/INVALID PRODUCTS
        const validCart = {
          ...res.data.cart,
          items: (res.data.cart?.items || []).filter(item => 
            item.product && 
            item.product._id && 
            item.product.name && 
            item.product.price > 0
          )
        };
        
        console.log("Filtered cart (valid items only):", validCart);
        setCart(validCart || { items: [], cartTotal: 0 });
        
        // Show warning if items were filtered out
        const originalCount = res.data.cart?.items?.length || 0;
        const filteredCount = validCart.items.length;
        if (originalCount > filteredCount) {
          setError(`${originalCount - filteredCount} invalid items were removed from your cart`);
        }
        
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  // ➕ Add quantity with better error handling
  const increaseQuantity = async (productId, currentQty) => {
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      alert("Invalid product. Cannot update quantity.");
      return;
    }
    
    setUpdating(productId);
    try {
      const res = await api.post("/cart/add", { 
        productId, 
        quantity: 1 
      }, { withCredentials: true });
      
      // Update cart with response
      const validCart = {
        ...res.data.cart,
        items: (res.data.cart?.items || []).filter(item => 
          item.product && item.product._id && item.product.price > 0
        )
      };
      setCart(validCart);
      setError("");
      
    } catch (error) {
      console.error("Failed to update quantity:", error.response || error);
      
      if (error.response?.status === 400) {
        setError("Invalid product. This item cannot be added to cart.");
      } else if (error.response?.status === 404) {
        setError("Product not found. It may have been deleted.");
      } else {
        setError("Failed to update item. Please try again.");
      }
      
      // Refresh cart to get current state
      try {
        const res = await api.get("/cart", { withCredentials: true });
        const validCart = {
          ...res.data.cart,
          items: (res.data.cart?.items || []).filter(item => 
            item.product && item.product._id && item.product.price > 0
          )
        };
        setCart(validCart);
      } catch (refreshError) {
        console.error("Failed to refresh cart:", refreshError);
      }
    } finally {
      setUpdating(null);
    }
  };

  // 💰 Calculate totals safely
  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => {
      if (!item?.product?.price || item.product.price <= 0) return sum;
      return sum + (item.product.price * (item.quantity || 1));
    }, 0);
  };

  // 🔧 Clean up invalid cart items (NEW FUNCTION)
  const cleanupInvalidItems = async () => {
    if (!window.confirm("Remove all invalid items from cart?")) return;
    
    setLoading(true);
    try {
      // Get current cart
      const res = await api.get("/cart", { withCredentials: true });
      const originalItems = res.data.cart?.items || [];
      
      // Filter valid items
      const validItems = originalItems.filter(item => 
        item.product && 
        item.product._id && 
        item.product.name && 
        item.product.price > 0
      );
      
      // If we have invalid items, we need to clear and re-add valid ones
      if (validItems.length < originalItems.length) {
        // Note: You need to implement backend endpoints for this
        alert("Backend cleanup not implemented. Showing only valid items.");
        
        // Update frontend state to show only valid items
        setCart({
          ...res.data.cart,
          items: validItems
        });
        
        setError(`${originalItems.length - validItems.length} invalid items filtered out`);
      } else {
        setError("");
      }
      
    } catch (error) {
      console.error("Cleanup failed:", error);
      setError("Failed to clean up cart");
    } finally {
      setLoading(false);
    }
  };

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view cart</h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const grandTotal = (subtotal + shipping + tax).toFixed(2);
  const validItemsCount = cart.items.filter(item => 
    item.product && item.product.price > 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with cleanup option */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-blue-100 mt-1">
                  {validItemsCount} {validItemsCount === 1 ? 'valid item' : 'valid items'} in your cart
                </p>
              </div>
              {error && (
                <button
                  onClick={cleanupInvalidItems}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                >
                  Clean Invalid Items
                </button>
              )}
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center">
                <div className="text-yellow-500 mr-2">⚠️</div>
                <div className="text-yellow-800">{error}</div>
              </div>
            </div>
          )}

          {/* Cart Content */}
          <div className="p-6">
            {validItemsCount === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">
                  {cart.items.length > 0 
                    ? "Your cart contains invalid items that cannot be displayed." 
                    : "Add some products to get started!"
                  }
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Valid Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cart.items
                      .filter(item => item.product && item.product.price > 0)
                      .map((item) => {
                        const product = item.product || {};
                        const itemId = item._id || product._id;
                        const itemPrice = product.price || 0;
                        const itemTotal = item.itemTotal || itemPrice * item.quantity;
                        
                        // Safe image URL - add fallback
                        const imageUrl = product.image 
                          ? (product.image.startsWith('http') || product.image.startsWith('/')
                              ? product.image 
                              : `/uploads/products/${product.image}`)
                          : null;
                        
                        return (
                          <div key={itemId} className="bg-gray-50 rounded-xl p-4 border">
                            <div className="flex items-center space-x-4">
                              {/* Product Image with error handling */}
                              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                  <img 
                                    src={imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center bg-gray-300">
                                          <span class="text-gray-500 text-sm">No Image</span>
                                        </div>
                                      `;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                    <span className="text-gray-500 text-sm">No Image</span>
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-grow">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg text-gray-800">
                                      {product.name || "Unknown Product"}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                      Price: ₹{itemPrice.toFixed(2)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => alert("Remove not implemented yet")}
                                    disabled={true}
                                    className="text-gray-400 p-1 cursor-not-allowed"
                                    title="Remove not available yet"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => alert("Decrease not implemented yet")}
                                      disabled={true}
                                      className="w-8 h-8 rounded-full border flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed"
                                      title="Decrease not available yet"
                                    >
                                      −
                                    </button>
                                    
                                    <div className="w-12 text-center">
                                      {updating === product._id ? (
                                        <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 rounded-full mx-auto"></div>
                                      ) : (
                                        <span className="font-bold text-lg">{item.quantity}</span>
                                      )}
                                    </div>
                                    
                                    <button
                                      onClick={() => increaseQuantity(product._id, item.quantity)}
                                      disabled={updating === product._id}
                                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                                    >
                                      +
                                    </button>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="font-bold text-lg">₹{itemTotal.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">
                                      ₹{itemPrice.toFixed(2)} × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white border rounded-xl p-6 sticky top-6">
                    <h2 className="text-xl font-bold mb-6 pb-4 border-b">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal ({validItemsCount} items)</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className={`font-medium ${subtotal > 500 ? 'text-green-600' : ''}`}>
                          {subtotal > 500 ? (
                            <>
                              FREE 
                              <span className="text-xs ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">Saved ₹50</span>
                            </>
                          ) : (
                            "₹50.00"
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (18%)</span>
                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-2xl font-bold text-blue-700">₹{grandTotal}</span>
                      </div>
                      {subtotal > 500 && (
                        <p className="text-sm text-green-600 mt-2">
                          ✅ Free shipping on orders above ₹500
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/checkout")}
                        disabled={validItemsCount === 0}
                        className={`w-full py-3 rounded-lg font-bold text-lg transition-all shadow-lg ${
                          validItemsCount === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl text-white'
                        }`}
                      >
                        {validItemsCount === 0 ? 'Cart Empty' : 'Proceed to Checkout'}
                      </button>
                      
                      <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
                      >
                        Continue Shopping
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-500 text-center">
                        🔒 Secure checkout • 💰 Multiple payment options • 🚚 Fast delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add mongoose validation helper
const mongoose = {
  Types: {
    ObjectId: {
      isValid: (id) => {
        // Simple ObjectId validation
        return id && /^[0-9a-fA-F]{24}$/.test(id);
      }
    }
  }
};