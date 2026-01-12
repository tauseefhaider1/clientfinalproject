import React from "react";

const StockFilter = ({ stock, setStock }) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">Availability</h4>

      <div className="space-y-2 text-sm">
        {["in", "limited", "out"].map((s) => (
          <label key={s} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"        
              checked={stock === s}
              onChange={() => setStock(s)}
            />
            {s === "in" && "In Stock"}
            {s === "limited" && "Limited Stock"}
            {s === "out" && "Out of Stock"}
          </label>
        ))}

        <button
          className="text-xs text-blue-500 mt-2"
          onClick={() => setStock(null)}
        >
          Clear filter
        </button>
      </div>
    </div>
  );
};

export default StockFilter;
