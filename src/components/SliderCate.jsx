import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../api/Azios";
import { FiChevronRight } from "react-icons/fi";

const SliderCate = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const STATIC_BASE =
    import.meta.env.VITE_API_STATIC ||
    "https://backend-final-project1-production.up.railway.app";

  // Helper to get image URL with fallback
  const getImageUrl = (imgPath) => {
    if (!imgPath || imgPath === "") {
      return `${STATIC_BASE}/uploads/default-category.png`;
    }
    return imgPath.startsWith("http") ? imgPath : `${STATIC_BASE}${imgPath}`;
  };

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("categories");
        console.log("API RESPONSE 👉", data);

        let categoriesData = [];
        if (Array.isArray(data)) categoriesData = data;
        else if (Array.isArray(data.categories)) categoriesData = data.categories;
        else if (Array.isArray(data.data)) categoriesData = data.data;

        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     SLIDER SETTINGS
  ========================= */
  const settings = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    arrows: false,
    pauseOnHover: true,
    beforeChange: (current, next) => setActiveIndex(next),
    responsive: [
      { 
        breakpoint: 1280, 
        settings: { 
          slidesToShow: 5, 
          centerPadding: "30px" 
        } 
      },
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 4, 
          centerPadding: "20px" 
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 3, 
          centerPadding: "15px" 
        } 
      },
      { 
        breakpoint: 480, 
        settings: { 
          slidesToShow: 2, 
          centerMode: false 
        } 
      },
    ],
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category._id}`, {
      state: { categoryName: category.title, categoryId: category._id },
    });
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex justify-center gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Categories Available</h3>
          <p className="text-gray-500 max-w-md mx-auto">We'll have exciting categories for you soon. Check back later!</p>
        </div>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-14 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-2">Explore our curated collections</p>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="group flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium mt-4 md:mt-0 px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
          >
            <span>View All Categories</span>
            <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Slider Container */}
        <div className="relative px-2">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <Slider {...settings}>
            {categories.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div key={item._id} className="px-2 md:px-3">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(item)}
                    className="w-full text-center focus:outline-none focus:ring-0 group"
                  >
                    {/* Image Container */}
                    <div className={`
                      relative w-36 h-36 md:w-44 md:h-44 mx-auto rounded-2xl 
                      flex items-center justify-center overflow-hidden 
                      transition-all duration-500 ease-out
                      ${isActive 
                        ? 'scale-110 shadow-2xl shadow-blue-100 ring-4 ring-blue-100 ring-opacity-50' 
                        : 'scale-95 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-gray-200'
                      }
                      group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-gray-200
                    `}>
                      {/* Background Gradient */}
                      <div className={`
                        absolute inset-0 bg-gradient-to-br 
                        ${isActive 
                          ? 'from-blue-50 to-indigo-50' 
                          : 'from-white to-gray-50'
                        }
                        transition-all duration-500
                      `}></div>
                      
                      {/* Image */}
                      <div className="relative w-4/5 h-4/5 rounded-full overflow-hidden">
                        <img
                          src={getImageUrl(item.img || item.image)}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = `${STATIC_BASE}/uploads/default-category.png`;
                          }}
                        />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <div className="mt-6 px-2">
                      <p className={`
                        text-base font-semibold 
                        ${isActive 
                          ? 'text-gray-900 scale-105' 
                          : 'text-gray-700'
                        }
                        group-hover:text-gray-900 group-hover:font-bold 
                        transition-all duration-300
                        line-clamp-1
                      `}>
                        {item.title || item.name}
                      </p>
                      
                      {/* Product Count (if available) */}
                      {(item.count || item.productCount) && (
                        <span className={`
                          inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium 
                          ${isActive 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600'
                          }
                          group-hover:bg-blue-100 group-hover:text-blue-700 
                          transition-all duration-300
                        `}>
                          {item.count || item.productCount} products
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </Slider>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center items-center space-x-2 mt-12">
          {categories.slice(0, Math.min(8, categories.length)).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 ${
                activeIndex === index 
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              } h-2 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderCate;