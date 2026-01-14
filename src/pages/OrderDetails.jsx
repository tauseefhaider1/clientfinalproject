import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/Azios";// Fixed typo: Azios → Axios

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await api.get(`/orders/${id}`);
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || "Failed to load order");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/my-orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link
            to="/my-orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/my-orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <span className="mr-2">←</span> Back to My Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-2">Order ID: {order._id}</p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.orderStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                  order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    order.orderStatus === 'delivered' ? 'bg-green-500' :
                    order.orderStatus === 'shipped' ? 'bg-blue-500' :
                    order.orderStatus === 'processing' ? 'bg-yellow-500' :
                    order.orderStatus === 'pending' ? 'bg-orange-500' :
                    order.orderStatus === 'cancelled' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></span>
                  {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-lg font-semibold mt-2">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                Rs {order.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Order Items</h2>
          </div>
          
          <div className="divide-y">
            {order.items?.map((item, index) => (
              <div key={index} className="p-6 flex items-center hover:bg-gray-50">
                <img
                  src={item.image || item.product?.image || '/placeholder-image.jpg'}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="ml-6 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title || item.product?.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-600">
                    Unit Price: Rs {item.price?.toLocaleString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-semibold text-gray-900">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rs {subtotal.toLocaleString()}</span>
            </div>
            
            {order.shippingCharge && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Rs {order.shippingCharge.toLocaleString()}</span>
              </div>
            )}
            
            {order.taxAmount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">Rs {order.taxAmount.toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between border-t pt-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                Rs {order.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        {(order.shippingAddress || order.paymentMethod) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {order.shippingAddress && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-2">
                  <p className="text-gray-900">{order.shippingAddress.street}</p>
                  <p className="text-gray-900">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-gray-900">
                    {order.shippingAddress.country} - {order.shippingAddress.zipCode}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-900">Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}

            {order.paymentMethod && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Status:</span> {order.paymentStatus}
                  </p>
                  {order.paymentId && (
                    <p className="text-gray-900">
                      <span className="font-medium">Transaction ID:</span> {order.paymentId}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => window.print()}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Print Order
          </button>
          
          <Link
            to="/my-orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Back to My Orders
          </Link>
          
          {order.orderStatus === 'pending' && (
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}