import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import { useAuth } from "../context/AuthContext";
// Icons
import api from "../api/Azios";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Sample data
  const cartItemsCount = 0;
  // const isLoggedIn = false; // This should come from your auth context
  // const { user, isLoggedIn } = useAuth(); // ✅ Add this line
const { isLoggedIn, logout } = useAuth();

  // ✅ FIXED: Clean menu items without duplicates
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Cart", path: "/cart" },
    // Only show these when logged in
    ...(isLoggedIn ? [
      { name: "My Orders", path: "/my-orders" },
      { name: "My Profile", path: "/profile" }
    ] : [])
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate("/profile"); // Changed from /account to /profile
    } else {
      navigate("/login");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Hamburger Menu */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? (
                  <CloseIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex items-center justify-center flex-1">
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <div className="relative">
                {searchOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <SearchIcon />
                      </button>
                    </form>
                  </div>
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <SearchIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? (
                  <Brightness7Icon className="w-5 h-5" />
                ) : (
                  <Brightness4Icon className="w-5 h-5" />
                )}
              </button>

              {/* Cart Icon */}
              <button 
                onClick={() => navigate('/cart')}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* ✅ FIXED: Uncomment and update Account Icon */}
              <button 
                onClick={handleAccountClick}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <PersonOutlineIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Drawer from Left - Always Visible When Open) */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            
            {/* Menu Drawer */}
<div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50">
              <div className="h-full flex flex-col">
                {/* Menu Header */}
                <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Navigation</p>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-grow overflow-y-auto py-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="flex items-center px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 group-hover:bg-blue-500 transition-colors"></div>
                      <span className="text-lg font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* Auth Section - ✅ FIXED: Updated for profile/orders */}
                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <PersonOutlineIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Welcome back!</p>
                        </div>
                        
                        {/* Profile button */}
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          My Profile
                        </button>
                        
                        {/* Orders button */}
                        <button
                          onClick={() => {
                            navigate('/my-orders');
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          My Orders
                        </button>
                      </div>
                      
              <button
  onClick={async () => {
    try {
      await api.post(
        "/api/auth/logout",
        {},
        { withCredentials: true } // ✅ cookie cleared
      );

      logout(); // ✅ clear auth state
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsMenuOpen(false);
    }
  }}
  className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
>
  Logout
</button>


                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <PersonOutlineIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">Welcome to our store!</p>
                        <button
                          onClick={() => {
                            navigate('/login');
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Login
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/register');
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Optional: Add Tailwind dark mode classes */}
      <style jsx>{`
        .dark {
          color-scheme: dark;
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .fixed.inset-y-0.left-0 {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;