import React from 'react'
import { CiSearch } from "react-icons/ci";

const ProductFilter = ({ search, setSearch }) => {
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearch(e.target.value);
    }
  };

  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm">
      <CiSearch className="text-gray-500 text-xl" />
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="w-full outline-none text-gray-700"
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ProductFilter;