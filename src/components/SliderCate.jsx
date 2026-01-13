import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../api/Azios";

const SliderCate = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const { data } = await api.get("categories"); // ✅ no extra /api
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
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 700,
    cssEase: "ease-in-out",
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
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
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading categories...</span>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No categories available
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="bg-white py-6 w-full overflow-hidden">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shop by Category</h2>
          <button
            onClick={() => navigate("/categories")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </button>
        </div>

        <Slider {...settings}>
          {categories.map((item) => (
            <div key={item._id} className="px-5">
              <button
                type="button"
                onClick={() => handleCategoryClick(item)}
                className="w-full text-center focus:outline-none cursor-pointer group"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center shadow-md overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <img
                    src={getImageUrl(item.img || item.image)}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `${STATIC_BASE}/uploads/default-category.png`;
                    }}
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-black group-hover:font-bold truncate px-2">
                  {item.title || item.name}
                </p>
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderCate;
