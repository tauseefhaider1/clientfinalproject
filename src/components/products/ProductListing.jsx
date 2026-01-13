import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import FiltersSidebar from "./FiltersSidebar";
import Card from "../Card";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [price, setPrice] = useState(9999999);
  const [rating, setRating] = useState(0);
  const [stock, setStock] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  useEffect(() => {
    const categoryFromState = location.state?.category;
    if (categoryFromState) {
      setSelectedCategory(categoryFromState);
    }
  }, [location.state]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);

    // Fetch categories
    axios.get("https://backend-final-project1-production.up.railway.app/api/categories")
      .then((res) => {
        let categoriesData = [];

        if (Array.isArray(res.data)) {
          categoriesData = res.data;
        } else if (Array.isArray(res.data?.categories)) {
          categoriesData = res.data.categories;
        } else if (Array.isArray(res.data?.data)) {
          categoriesData = res.data.data;
        } else if (res.data?.success && Array.isArray(res.data?.categories)) {
          categoriesData = res.data.categories;
        }

        setCategories(categoriesData);

        // Fetch products
        return axios.get("https://backend-final-project1-production.up.railway.app/product");
      })
      .then((res) => {
        let productsData = [];

        if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (Array.isArray(res.data?.products)) {
          productsData = res.data.products;
        } else if (Array.isArray(res.data?.data)) {
          productsData = res.data.data;
        } else if (res.data?.success && Array.isArray(res.data?.data)) {
          productsData = res.data.data;
        }

        setProducts(productsData);

        if (categories.length === 0) {
          const uniqueCategories = [];
          productsData.forEach(product => {
            if (product.category && typeof product.category === 'object' && product.category._id) {
              const exists = uniqueCategories.find(cat => cat._id === product.category._id);
              if (!exists) uniqueCategories.push(product.category);
            } else if (product.category && typeof product.category === 'string') {
              const exists = uniqueCategories.find(cat => cat._id === product.category);
              if (!exists) {
                uniqueCategories.push({
                  _id: product.category,
                  title: `Category ${product.category.slice(0, 8)}...`,
                  slug: product.category
                });
              }
            }
          });

          if (uniqueCategories.length > 0) {
            setCategories([{ _id: "all", title: "All" }, ...uniqueCategories]);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    if (product.price > price) return false;

    if (rating > 0 && product.rating < rating) return false;

    if (stock === "in" && product.stockStatus !== "in") return false;
    if (stock === "out" && product.stockStatus !== "out") return false;
    if (stock === "limited" && product.stockStatus !== "limited") return false;

    // Category filter: check against lowercase "all"
    if (selectedCategory !== "all") {
      if (typeof product.category === 'object' && product.category._id) {
        return product.category._id === selectedCategory;
      } else {
        return product.category === selectedCategory;
      }
    }

    return true;
  });

  // Group products by category for display
  const groupedProducts = {};

  if (selectedCategory === "all") {
    filteredProducts.forEach(product => {
      let categoryId, categoryName;

      if (typeof product.category === 'object' && product.category._id) {
        categoryId = product.category._id;
        categoryName = product.category.title || product.category.name || "Uncategorized";
      } else if (product.category) {
        categoryId = product.category;
        const categoryObj = categories.find(cat => cat._id === product.category);
        categoryName = categoryObj?.title || categoryObj?.name || `Category ${product.category.slice(0, 8)}...`;
      } else {
        categoryId = "uncategorized";
        categoryName = "Uncategorized";
      }

      if (!groupedProducts[categoryId]) {
        groupedProducts[categoryId] = {
          name: categoryName,
          id: categoryId,
          products: []
        };
      }

      groupedProducts[categoryId].products.push(product);
    });
  } else {
    const category = categories.find(cat => cat._id === selectedCategory);
    groupedProducts[selectedCategory] = {
      name: category?.title || category?.name || selectedCategory,
      id: selectedCategory,
      products: filteredProducts
    };
  }

  // Handle category click from sidebar
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate(`/products${categoryId !== "all" ? `?category=${categoryId}` : ''}`, {
      replace: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 py-4 bg-[#050b18] min-h-screen">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <FiltersSidebar
          price={price}
          setPrice={setPrice}
          rating={rating}
          setRating={setRating}
          stock={stock}
          setStock={setStock}
          category={selectedCategory}           // use "category" here (not selectedCategory)
          setCategory={handleCategorySelect}   // use "setCategory" here
          categories={categories}
        />
      </div>

      {/* Products Section */}
      <div className="md:col-span-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {selectedCategory === "all"
              ? "All Products"
              : `${categories.find(c => c._id === selectedCategory)?.title || selectedCategory} Products`}
          </h1>
          <p className="text-gray-400 mt-2">
            {selectedCategory === "all"
              ? `Showing ${filteredProducts.length} products from all categories`
              : `Showing ${filteredProducts.length} products from ${categories.find(c => c._id === selectedCategory)?.title || selectedCategory} category`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-xl">No products found</p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => handleCategorySelect("all")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.values(groupedProducts).map((categoryGroup) => (
              <section
                key={categoryGroup.id}
                className="scroll-mt-20"
                id={categoryGroup.id}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {categoryGroup.name}{" "}
                      <span className="text-blue-400 ml-2">
                        ({categoryGroup.products.length})
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Browse all products in {categoryGroup.name}
                    </p>
                  </div>

                  {selectedCategory === "all" && (
                    <button
                      onClick={() => handleCategorySelect(categoryGroup.id)}
                      className="text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                    >
                      View all in {categoryGroup.name} →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryGroup.products.map((product) => (
                    <Card key={product._id} product={product} />
                  ))}
                </div>

                {categoryGroup.products.length > 4 && selectedCategory === "all" && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => handleCategorySelect(categoryGroup.id)}
                      className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition border border-gray-700"
                    >
                      View all {categoryGroup.products.length} {categoryGroup.name} products
                    </button>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-center">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}{" "}
              {selectedCategory !== "all" ? ` in ${categories.find(c => c._id === selectedCategory)?.title || selectedCategory}` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
