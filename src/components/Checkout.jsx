import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Azios.js";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🛒 Cart from backend
  const [cartItems, setCartItems] = useState([]);

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

  // 🔄 Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/cart", {
          withCredentials: true,
        });

        setCartItems(res.data.cart.items || []);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };

    if (user) fetchCart();
  }, [user]);

  // ✏️ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💰 Calculate total from backend cart
  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  // 📦 Submit order
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

    setLoading(true);

    try {
      const res = await api.post(
        "/api/orders/create",
        {
          ...formData,
          items: cartItems,
          totalAmount: calculateTotal(),
        },
        { withCredentials: true }
      );

      setOrderId(res.data.orderId);
      setOrderSuccess(true);

      // 🧹 Clear backend cart
      await api.delete("/api/cart/clear", {
        withCredentials: true,
      });

      setTimeout(() => navigate("/orders"), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎉 Success UI
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Order ID: <span className="font-mono font-bold">{orderId}</span>
          </p>
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
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-6">Complete your purchase</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <input
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded-lg"
              required
            />

            <input
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded-lg"
              required
            />

            <textarea
              name="address"
              placeholder="Address *"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows="3"
              required
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium"
          >
            {loading ? "Processing..." : `Place Order - ₹${grandTotal}`}
          </button>
        </form>
      </div>
    </div>
  );
}
