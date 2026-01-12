const PriceFilter = ({ price, setPrice }) => {
  return (
    <div>
      <h4 className="font-semibold mb-2">Price Range</h4>

      <input
        type="range"
        min="0"
        max="150000"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full accent-blue-500"
      />

      <div className="flex justify-between text-sm text-gray-400">
        <span>Rs 0</span>
        <span>Rs {price}</span>
      </div>
    </div>
  );
};

export default PriceFilter;
