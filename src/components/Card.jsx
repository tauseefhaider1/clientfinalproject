import imgpro from "../assets/product.jpg";
import { useNavigate } from "react-router-dom";

// ✅ use env if available, fallback for dev
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4534";

const Card = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const imageSrc = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`
    : imgpro;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition"
    >
      <img
        src={imageSrc}
        alt={product?.name || "product"}
        className="w-full h-56 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null; // prevent loop
          e.currentTarget.src = imgpro;
        }}
      />

      <div className="p-4 space-y-2">
        <h2 className="font-bold text-lg">{product.name}</h2>

        <p className="text-gray-600">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            product.stockStatus === "in"
              ? "bg-green-100 text-green-700"
              : product.stockStatus === "limited"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stockStatus === "in"
            ? "In Stock"
            : product.stockStatus === "limited"
            ? "Limited"
            : "Out of Stock"}
        </span>
      </div>
    </div>
  );
};

export default Card;
