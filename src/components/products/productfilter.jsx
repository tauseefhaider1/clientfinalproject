import React from 'react'
import { CiSearch } from "react-icons/ci";

const ProductFilter = ({ search, setSearch }) => {
  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm">
      <CiSearch className="text-gray-500 text-xl" />
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full outline-none text-gray-700"
      />
    </div>
  )
}

export default ProductFilter
