import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Azios.js";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🛒 Cart from backend
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // 📝 Form state
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "credit_card",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // 🔄 Fetch cart from backend with null product filtering
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart", {
          withCredentials: true,
        });

        console.log("Cart API response:", res.data);
        
        // Filter out items with null products
        const validItems = (res.data.cart?.items || []).filter(
          (item) => item?.product !== null && item?.product !== undefined
        );
        
        console.log("Valid cart items:", validItems);
        setCartItems(validItems);
        
        // Redirect if no valid items
        if (validItems.length === 0) {
          alert("Your cart is empty or contains invalid items");
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to fetch cart", err);
        alert("Failed to load cart. Please try again.");
        navigate("/");
      } finally {
        setCartLoading(false);
      }
    };

    if (user) {
      fetchCart();
    } else {
      setCartLoading(false);
    }
  }, [user, navigate]);

  // ✏️ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💰 Safe total calculation with null checks
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      if (!item?.product?.price) return sum;
      return sum + (item.product.price * (item.quantity || 1));
    }, 0);
  };

  📦 Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // Form validation
    if (!formData.fullName.trim() || !formData.address.trim() || !formData.phone.trim()) {
      alert("Please fill all required fields (*)");
      return;
    }

    // Phone validation (optional)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        shippingInfo: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name
        })),
        totalAmount: calculateTotal(),
        taxAmount: calculateTotal() * 0.18,
        shippingAmount: calculateTotal() > 500 ? 0 : 50,
        finalAmount: (calculateTotal() + (calculateTotal() * 0.18) + (calculateTotal() > 500 ? 0 : 50)).toFixed(2)
      };

      console.log("Submitting order:", orderData);

      const res = await api.post(
        "/orders/create",
        orderData,
        { withCredentials: true }
      );

      console.log("Order response:", res.data);

      if (res.data.success) {
        setOrderId(res.data.orderId || res.data.order?._id || "N/A");
        setOrderSuccess(true);

        // 🧹 Clear backend cart
        try {
          await api.delete("/cart/clear", {
            withCredentials: true,
          });
          console.log("Cart cleared successfully");
        } catch (clearErr) {
          console.warn("Cart clear failed (but order placed):", clearErr);
        }

        // Auto-redirect after 3 seconds
        setTimeout(() => navigate("/orders"), 3000);
      } else {
        throw new Error(res.data.message || "Order creation failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert(err.response?.data?.message || err.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎉 Success UI
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order has been confirmed and will be shipped soon.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-mono font-bold text-lg text-gray-800 break-all">
              {orderId}
            </p>
          </div>
          <p className="text-sm text-gray-500 animate-pulse">
            Redirecting to orders page in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Show loading while fetching cart
  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const grandTotal = (subtotal + shipping + tax).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-blue-100 mt-1">Complete your purchase</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cart Items Summary */}
            {cartItems.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-xl border">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Items in Cart</h2>
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    if (!item?.product) return null;
                    
                    return (
                      <div key={item.product._id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                            {item.product.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">IMG</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.product.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    placeholder="House no, Street, Area, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    name="postalCode"
                    placeholder="PIN Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                    {shipping === 0 && subtotal > 0 && (
                      <span className="text-xs ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">🎉 Saved ₹50</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-700">₹{grandTotal}</span>
                  </div>
                  {subtotal > 500 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ Free shipping applied on orders above ₹500
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method (Optional) */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === "credit_card"}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Credit/Debit Card</span>
                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                loading || cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Order...
                </div>
              ) : (
                `Place Order - ₹${grandTotal}`
              )}
            </button>

            {/* Security Notice */}
            <p className="text-center text-sm text-gray-500 pt-4">
              🔒 Your payment information is secure and encrypted
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}