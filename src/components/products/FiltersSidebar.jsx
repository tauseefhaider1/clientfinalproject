import PriceFilter from "./Pricefilter";
import StockFilter from "./stockFilter";
import CategoryFilter from "./categoryFilter";
const FiltersSidebar = ({
  price,
  setPrice,
  stock,
  setStock,
  category,     
    setCategory,  
  categories
}) => {
  return (
    <div className="bg-[#0b1220] text-white p-4 rounded-xl space-y-6">
      <h2 className="text-lg font-bold">Filters</h2>

      <PriceFilter price={price} setPrice={setPrice} />
      <StockFilter stock={stock} setStock={setStock} />
      <CategoryFilter category={category} setCategory={setCategory} categories={categories} />
    </div>
  );
};



export default FiltersSidebar;
