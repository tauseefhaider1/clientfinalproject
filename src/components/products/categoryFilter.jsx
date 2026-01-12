import { useEffect, useState } from "react";
import api from "../../api/Azios";
import React from "react";

const CategoryFilter = ({ category, setCategory, categories }) => {
  const handleSetCategory = (value) => {
    if (typeof setCategory !== "function") {
      console.error("setCategory is NOT a function:", setCategory);
      return;
    }
    setCategory(value);
  };

  return (
    <div>
      <h4 className="font-semibold mb-2 text-white">Category</h4>

      <div className="space-y-1 text-sm">
        {/* ALL CATEGORIES BUTTON */}
        <button
          onClick={() => handleSetCategory("all")} // or "All" based on your app convention
          className={`block w-full text-left px-3 py-2 rounded transition ${
            category === "all" // make sure this matches the value above
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          All Categories
        </button>

        {/* DYNAMIC CATEGORIES */}
        {categories.length > 0 ? (
          categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleSetCategory(cat._id)}
              className={`block w-full text-left px-3 py-2 rounded transition ${
                category === cat._id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {cat.title}
            </button>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
