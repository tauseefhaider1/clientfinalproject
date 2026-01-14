import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import { useAuth } from "../context/AuthContext";
import api from "../api/Azios";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const cartItemsCount = 0;

  // 🔥 Persist dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Cart", path: "/cart" },
    ...(isLoggedIn
      ? [
          { name: "My Orders", path: "/my-orders" },
          { name: "Profile", path: "/profile" },
        ]
      : []),
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout", // ✅ FIXED (NO /api/api)
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LEFT */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MenuIcon />
          </button>

          {/* CENTER LOGO */}
          <Link to="/" className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-9" />
          </Link>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <SearchIcon />
            </button>

            {/* Theme */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCartIcon />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() =>
                navigate(isLoggedIn ? "/profile" : "/login")
              }
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <PersonOutlineIcon />
            </button>
          </div>
        </div>

        {/* SEARCH DROPDOWN */}
        {searchOpen && (
          <div className="absolute right-4 top-16 w-[90%] sm:w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
              />
              <button className="absolute right-3 top-2.5 text-gray-500">
                <SearchIcon />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl animate-slide">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-col">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-4 border-b hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-6 border-t">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full mb-3 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full mb-3 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style>{`
        .animate-slide {
          animation: slide 0.3s ease-out;
        }
        @keyframes slide {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
