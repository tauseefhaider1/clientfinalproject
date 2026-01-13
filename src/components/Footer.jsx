import React from "react";
import logo from "../assets/logo1.png";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <footer className="bg-[#0b1220] text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src={logo} alt="TechVibe" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="text-xl font-bold text-white">TechVibe</h2>
              <p className="text-xs text-gray-400">Premium Tech Store</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted destination for modern electronics and smart solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Products", "About Us", "FAQs", "Contact", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-400 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <LocationOnIcon fontSize="small" className="text-blue-400" />
              <span>Innovation City</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon fontSize="small" className="text-blue-400" />
              <span>+1 555 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon fontSize="small" className="text-blue-400" />
              <span>support@techvibe.com</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            {[FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-blue-600 transition"
              >
                <Icon fontSize="small" className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} <span className="text-white">TechVibe</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
