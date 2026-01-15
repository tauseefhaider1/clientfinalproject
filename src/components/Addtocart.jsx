import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/Azios";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [user, loading, navigate, location.pathname]);

  // 🛒 FETCH CART FROM BACKEND (🔥 MAIN FIX)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart", {
          withCredentials: true,
        });

        console.log("CART RESPONSE:", res.data);
        setCart(res.data.cart?.items || []);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setCartLoading(false);
      }
    };

    if (user) fetchCart();
  }, [user]);

  // ❌ Redirect if cart empty
  useEffect(() => {
    if (!cartLoading && user && cart.length === 0) {
      alert("Your cart is empty");
      navigate("/");
    }
  }, [cart, cartLoading, user, navigate]);

  // 🧮 Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // 📝 Form state
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "credit_card",
  });

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  setLoadingOrder(true);

  try {
    const { data } = await api.post(
      "/orders/create",
      {
        paymentMethod: "cod", // or default
      },
      { withCredentials: true }
    );

    setOrderId(data.orderId);
    setOrderSuccess(true);

    setTimeout(() => {
      navigate("/orders");
    }, 1500);

  } catch (error) {
    alert(error.response?.data?.message || "Order failed");
  } finally {
    setLoadingOrder(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {cart.map((item) => (
          <div key={item.product._id} className="flex justify-between mb-2">
            <span>{item.product.name} × {item.quantity}</span>
            <span>₹{item.product.price * item.quantity}</span>
          </div>
        ))}

        <div className="font-bold mt-4">Total: ₹{total.toFixed(2)}</div>

        <button
          onClick={handleSubmit}
          disabled={loadingOrder}
          className="w-full bg-green-600 text-white py-3 rounded-lg mt-6"
        >
          {loadingOrder ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
z