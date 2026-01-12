import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import api from "./api/Azios"; // Fixed typo: Azios → Axios

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SliderCate from "./components/SliderCate";

// Pages & Components
import HomeSlider from "./components/HomeSlider";
import Card from "./components/Card";
import ProductDetail from "./components/Productdetail";
import ProductListing from "./components/products/ProductListing";
import FAQ from "./components/Faq";
import About from "./components/About";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CheckoutPage from "./components/Checkout";
import CartPage from "./components/Addtocart";
import OtpVerification from "./components/OtpVerfication";
import ForgotPassword from "./components/ForgotPasssword";
import ResetPassword from "./components/ResetPassword";

// ✅ Import the new components
import Orders from "./components/orders";
import MyOrders from "./pages/Myorders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";

// Routes
import PrivateRoute from "./routes/PrivateRoutes";
const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4534/product")
      .then((res) => {
        const data = res.data.products || res.data;
        setProducts(data.slice(0, 6));
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* 🔥 TOP SLIDER */}
      <HomeSlider />

      {/* 🟢 CATEGORY SLIDER BELOW HOME SLIDER */}
      <SliderCate />

      {/* ⭐ FEATURED PRODUCTS */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

/* ---------------- APP COMPONENT ---------------- */
const App = () => {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:category" element={<ProductListing />} />
          
          {/* Auth */}
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />

          {/* Info */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <h1 className="text-4xl font-bold">404 | Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
  

export default App;