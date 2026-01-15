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

  // 🔄 Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart", { withCredentials: true });
        console.log("Cart data:", res.data);
        setCart(res.data.cart || { items: [], cartTotal: 0 });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        alert("Failed to load cart");
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

  // ➕ Add quantity (WORKS - you have /cart/add endpoint)
  const increaseQuantity = async (productId, currentQty) => {
    setUpdating(productId);
    try {
      await api.post("/cart/add", { 
        productId, 
        quantity: 1 
      }, { withCredentials: true });
      
      // Refresh cart
      const res = await api.get("/cart", { withCredentials: true });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update item");
    } finally {
      setUpdating(null);
    }
  };

  // ➖ TEMPORARY FIX: Decrease quantity using same /cart/add endpoint
  const decreaseQuantity = async (productId, currentQty) => {
    if (currentQty <= 1) {
      if (window.confirm("Remove this item from cart?")) {
        await removeFromCart(productId);
      }
      return;
    }
    
    setUpdating(productId);
    try {
      // TEMPORARY: We'll remove the item and re-add with lower quantity
      // This is not optimal but works until you add update endpoint
      console.warn("⚠️ Using workaround - needs proper update endpoint");
      
      // First remove the item
      await api.delete(`/cart/remove/${productId}`, { 
        withCredentials: true 
      });
      
      // Then add it back with quantity-1
      await api.post("/cart/add", { 
        productId, 
        quantity: currentQty - 1 
      }, { withCredentials: true });
      
      // Refresh cart
      const res = await api.get("/cart", { withCredentials: true });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update item. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // ❌ TEMPORARY: Simulate remove by adding with quantity 0
  const removeFromCart = async (productId) => {
    setUpdating(productId);
    try {
      // Since you don't have remove endpoint yet, show error
      console.error("❌ Backend remove endpoint not implemented");
      alert("Remove functionality not available yet. Please implement /cart/remove/:productId endpoint.");
      
      // Option: You could clear entire cart as workaround
      // await api.delete("/cart/clear", { withCredentials: true });
      // const res = await api.get("/cart", { withCredentials: true });
      // setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Remove endpoint not available");
    } finally {
      setUpdating(null);
    }
  };

  // 🧹 TEMPORARY: Clear cart (you need to implement this)
  const clearCart = async () => {
    if (!window.confirm("Remove all items from cart?")) return;
    
    try {
      // Since you don't have clear endpoint yet, show error
      console.error("❌ Backend clear endpoint not implemented");
      alert("Clear cart functionality not available yet. Please implement /cart/clear endpoint.");
      
      // Option: Manually clear frontend state (but backend will still have items)
      // setCart({ items: [], cartTotal: 0 });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert("Clear endpoint not available");
    }
  };

  // 💰 Calculate totals
  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => {
      const price = item.product?.price || item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-blue-100 mt-1">
                  {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              {cart.items.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition opacity-50 cursor-not-allowed"
                    title="Clear cart not available yet"
                  >
                    Clear Cart (Disabled)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cart Content */}
          <div className="p-6">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Warning about missing endpoints */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    ⚠️ <strong>Note:</strong> Remove and clear cart features are disabled because backend endpoints are not implemented yet.
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    You can only increase quantity. To decrease/remove, you need to add: 
                    <code className="bg-yellow-100 px-1 mx-1">/cart/update/:productId</code>, 
                    <code className="bg-yellow-100 px-1 mx-1">/cart/remove/:productId</code>, and 
                    <code className="bg-yellow-100 px-1 mx-1">/cart/clear</code> endpoints.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Cart Items */}
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {cart.items.map((item) => {
                        const product = item.product || {};
                        const itemId = item._id || product._id;
                        const itemPrice = product.price || item.price || 0;
                        const itemTotal = item.itemTotal || itemPrice * item.quantity;
                        
                        return (
                          <div key={itemId} className="bg-gray-50 rounded-xl p-4 border">
                            <div className="flex items-center space-x-4">
                              {/* Product Image */}
                              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
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
                                    onClick={() => removeFromCart(product._id)}
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
                                      onClick={() => decreaseQuantity(product._id, item.quantity)}
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
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className={`font-medium ${calculateSubtotal() > 500 ? 'text-green-600' : ''}`}>
                            {calculateSubtotal() > 500 ? (
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
                          <span className="font-medium">
                            ₹{(calculateSubtotal() * 0.18).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Total</span>
                          <span className="text-2xl font-bold text-blue-700">
                            ₹{(
                              calculateSubtotal() + 
                              (calculateSubtotal() > 500 ? 0 : 50) + 
                              (calculateSubtotal() * 0.18)
                            ).toFixed(2)}
                          </span>
                        </div>
                        {calculateSubtotal() > 500 && (
                          <p className="text-sm text-green-600 mt-2">
                            ✅ Free shipping on orders above ₹500
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => navigate("/checkout")}
                          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                        >
                          Proceed to Checkout
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}