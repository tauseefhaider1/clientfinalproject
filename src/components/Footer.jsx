import React from "react";
import logo from "../assets/logo1.png";

// MUI Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white px-6 md:px-10 lg:px-16 py-12">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
        
        {/* Logo and Company Info */}
        <div className="lg:col-span-1">
          {/* Large Logo Display */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <img 
                  src={logo} 
                  className="w-16 h-16 object-contain" 
                  alt="TechVibe Logo" 
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TechVibe
                </h2>
                <p className="text-xs text-gray-400">Premium Tech Solutions</p>
              </div>
            </div>
          </div>
          
          {/* Company Description */}
          <p className="text-gray-300 leading-relaxed mb-6 text-sm">
            Your premier destination for cutting-edge electronic gadgets and modern tech solutions. 
            From professional workstations to leisure technology, we deliver excellence in every product.
          </p>
          
          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <LocationOnIcon className="text-blue-400 mt-1 text-sm" />
              <span className="text-gray-300 text-sm">123 Tech Street, Innovation City</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="text-blue-400 text-sm" />
              <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <AccessTimeIcon className="text-blue-400 text-sm" />
              <span className="text-gray-300 text-sm">Mon-Sat: 9AM - 8PM</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-6">
            {/* Shop */}
            <div>
              <h6 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-700 inline-block">
                Shop
              </h6>
              <ul className="space-y-3">
                {["Deals & Discounts", "Personal Audio", "Speakers", "Power Banks", "Accessories"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h6 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-700 inline-block">
                Help
              </h6>
              <ul className="space-y-3">
                {["Track Your Order", "Warranty Policy", "FAQs", "Complaint Form", "Contact Us"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="lg:col-span-1">
          <h6 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-700 inline-block">
            Company
          </h6>
          <ul className="space-y-3 mb-8">
            {["About Us", "Careers", "Privacy Policy", "Terms & Conditions", "Why Buy Direct?"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Social Media */}
          <div>
            <p className="text-gray-400 text-sm mb-4">Follow Us</p>
            <div className="flex gap-2">
              {[
                { icon: <FacebookIcon />, color: "hover:bg-blue-500", label: "Facebook" },
                { icon: <InstagramIcon />, color: "hover:bg-gradient-to-r from-pink-500 to-purple-500", label: "Instagram" },
                { icon: <YouTubeIcon />, color: "hover:bg-red-500", label: "YouTube" },
                { icon: <WhatsAppIcon />, color: "hover:bg-green-500", label: "WhatsApp" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${social.color} transition-all duration-300 border border-gray-700 hover:border-transparent group relative`}
                  title={social.label}
                >
                  <span className="text-white group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-1">
          <h6 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-700 inline-block">
            Newsletter
          </h6>
          <p className="text-gray-400 text-sm mb-6">
            Subscribe for exclusive offers, new arrivals, and tech insights
          </p>
          
          {/* Newsletter Input */}
          <div className="mb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center px-4 py-3">
                <EmailIcon className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm"
                />
                <button className="ml-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-300">
                  <SendIcon className="text-white" />
                </button>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
          
          {/* Payment Methods */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Secure Payments</p>
            <div className="flex gap-2">
              {["💳", "🏦", "🔒", "💎"].map((icon, index) => (
                <div 
                  key={index}
                  className="w-10 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm border border-gray-700"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright with logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              className="w-8 h-8 object-contain" 
              alt="Logo" 
            />
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="text-white font-medium">TechVibe</span>. All rights reserved.
            </div>
          </div>
          
          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
        
        {/* Tagline */}
        <div className="text-center text-xs text-gray-500 mt-4">
          Elevating Technology • Empowering Lives • Exceeding Expectations
        </div>
      </div>
    </footer>
  );
};

export default Footer;