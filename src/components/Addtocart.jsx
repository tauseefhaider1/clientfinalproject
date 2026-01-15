import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/Azios.js";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  // 🔄 Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await api.get("/cart");
        
        console.log("🛒 CART PAGE DATA:", res.data);
        
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
          // ✅ SAFE: Filter out items with null price
          const items = (res.data.cart.items || []).filter(item => 
            item && typeof item.price === 'number' && !isNaN(item.price)
          );
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
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

  // 🔄 Update quantity - SAFE VERSION
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await api.put(`/cart/update/${itemId}`, { quantity: newQuantity });
      // Refresh cart
      const res = await api.get("/cart");
      if (res.data.success) {
        const items = (res.data.cart.items || []).filter(item => 
          item && typeof item.price === 'number' && !isNaN(item.price)
        );
        setCartItems(items);
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update quantity");
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // ❌ Remove item
  const removeItem = async (itemId) => {
    if (!window.confirm("Remove item from cart?")) return;
    
    try {
      await api.delete(`/cart/remove/${itemId}`);
      // Refresh cart
      const res = await api.get("/cart");
      if (res.data.success) {
        const items = (res.data.cart.items || []).filter(item => 
          item && typeof item.price === 'number' && !isNaN(item.price)
        );
        setCartItems(items);
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove item");
    }
  };

  // 💰 Calculate total - SAFE
  const calculateTotal = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    
    try {
      return cartItems.reduce((sum, item) => {
        if (!item) return sum;
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);
    } catch (error) {
      console.error("Calculate total error:", error);
      return 0;
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🛒 Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link to="/products" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              {cartItems.map((item, index) => {
                // SAFE values
                const itemName = item?.name || `Item ${index + 1}`;
                const itemPrice = Number(item?.price) || 0;
                const itemQuantity = Number(item?.quantity) || 1;
                const itemImage = item?.image || "https://via.placeholder.com/100";
                const itemId = item?.product || index;

                return (
                  <div key={itemId} className="flex items-center border-b py-6">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={itemImage} 
                        alt={itemName}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                      />
                    </div>

                    {/* Details */}
                    <div className="ml-6 flex-1">
                      <h3 className="font-semibold text-lg">{itemName}</h3>
                      <p className="text-gray-600">₹{itemPrice.toFixed(2)}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => updateQuantity(itemId, itemQuantity - 1)}
                          disabled={updating[itemId] || itemQuantity <= 1}
                          className="px-3 py-1 border rounded-l disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b">
                          {updating[itemId] ? "..." : itemQuantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                          disabled={updating[itemId]}
                          className="px-3 py-1 border rounded-r disabled:opacity-50"
                        >
                          +
                        </button>
                        
                        <button
                          onClick={() => removeItem(itemId)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{(itemPrice * itemQuantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{total > 500 ? "FREE" : "₹50"}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total > 500 ? total.toFixed(2) : (total + 50).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
              
              <Link to="/products" className="block mt-4 text-center text-blue-600">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}