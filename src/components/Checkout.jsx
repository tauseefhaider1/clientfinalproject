import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Azios.js";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🛒 Cart from backend
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📝 Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    phone: user?.phone || "",
    paymentMethod: "cod",
  });

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // 🔄 Fetch cart from backend - UPDATED WITH NULL PROTECTION
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await api.get("/cart");
        
        console.log("🛒 CART API RESPONSE:", res.data);
        
        if (res.data.success) {
          setCart(res.data.cart);
          
          // ✅ CRITICAL FIX: Filter out items with null/undefined price
          const items = (res.data.cart?.items || []).filter(item => {
            // Check if item has a valid price
            const hasValidPrice = item && 
                                 typeof item.price === 'number' && 
                                 !isNaN(item.price) && 
                                 item.price > 0;
            
            if (!hasValidPrice) {
              console.warn("⚠️ Removing cart item with invalid price:", item);
            }
            return hasValidPrice;
          });
          
          console.log(`✅ Cleaned ${items.length} valid cart items`);
          setCartItems(items);
        } else {
          console.error("Cart fetch failed:", res.data.message);
          setCartItems([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err.response?.data || err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✏️ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💰 Calculate total - COMPLETELY SAFE VERSION
  const calculateTotal = () => {
    if (!cart || !Array.isArray(cartItems)) return 0;
    
    // Use backend cartTotal if available
    if (cart.cartTotal && typeof cart.cartTotal === 'number') {
      return cart.cartTotal;
    }
    
    // SAFE reduce with null checks
    try {
      const total = cartItems.reduce((sum, item) => {
        if (!item) return sum;
        
        // Get price safely
        const price = item.price || 
                     (item.product && typeof item.product.price === 'number' ? item.product.price : 0) || 
                     0;
        
        // Get quantity safely
        const quantity = item.quantity || 1;
        
        // Ensure both are numbers
        const itemPrice = Number(price) || 0;
        const itemQty = Number(quantity) || 1;
        
        return sum + (itemPrice * itemQty);
      }, 0);
      
      return total;
    } catch (error) {
      console.error("Error calculating total:", error);
      return 0;
    }
  };

  // 📦 Submit order - UPDATED
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!formData.fullName || !formData.address || !formData.phone) {
      alert("Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setOrderLoading(true);

    try {
      // ✅ Create order with safe data
      const orderRes = await api.post("/orders/create", {
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateTotal(),
        // Send only valid items
        items: cartItems.filter(item => item && item.price).map(item => ({
          product: item.product,
          name: item.name || "Product",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || ""
        }))
      });

      console.log("✅ Order response:", orderRes.data);
      
      if (orderRes.data.success) {
        setOrderId(orderRes.data.order?._id || orderRes.data.orderId);
        setOrderSuccess(true);
        
        // ✅ Clear cart after successful order
        try {
          await api.delete("/cart/clear");
          console.log("✅ Cart cleared successfully");
        } catch (clearErr) {
          console.warn("⚠️ Failed to clear cart:", clearErr.message);
        }

        // Navigate to orders page after 3 seconds
        setTimeout(() => navigate("/orders"), 3000);
      } else {
        throw new Error(orderRes.data.message || "Order failed");
      }
    } catch (err) {
      console.error("❌ Order error:", err.response?.data || err);
      alert(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // 🎉 Success UI
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order ID is: <span className="font-mono font-bold">{orderId}</span>
          </p>
          <p className="text-gray-500 text-sm">Redirecting to orders page...</p>
        </div>
      </div>
    );
  }

  // 🛒 Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to checkout</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // ✅ Calculate totals with null protection
  const subtotal = calculateTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const grandTotal = (subtotal + shipping + tax).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Debug info - keep temporarily */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium">Debug Info:</p>
          <p className="text-xs">Cart items: {cartItems.length}</p>
          <p className="text-xs">Backend cart total: ₹{cart?.cartTotal || 0}</p>
          <p className="text-xs">Calculated subtotal: ₹{calculateTotal()}</p>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-6">Complete your purchase</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    required
                  />

                  <input
                    name="phone"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    required
                  />
                </div>

                <textarea
                  name="address"
                  placeholder="Full Address (Street, Area, Landmark) *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg mb-4"
                  rows="3"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={orderLoading || cartItems.length === 0}
                className={`w-full py-4 rounded-xl font-medium text-lg ${
                  orderLoading || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {orderLoading ? "Processing..." : `Place Order - ₹${grandTotal}`}
              </button>
            </form>
          </div>

          {/* Right column - Order Summary - ULTRA SAFE VERSION */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items - COMPLETELY SAFE */}
              <div className="mb-4 max-h-64 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No valid items</p>
                ) : (
                  cartItems.map((item, index) => {
                    // Safe extraction
                    const itemName = item?.name || item?.product?.name || `Item ${index + 1}`;
                    const itemPrice = item?.price || 0;
                    const itemQuantity = item?.quantity || 1;
                    
                    return (
                      <div key={item?._id || index} className="flex justify-between py-2 border-b">
                        <div className="flex-1">
                          <p className="font-medium truncate">{itemName}</p>
                          <p className="text-sm text-gray-500">Qty: {itemQuantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹{(itemPrice * itemQuantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">₹{itemPrice} each</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}