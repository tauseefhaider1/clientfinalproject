import { useEffect, useState } from "react";
import api from "../api/Azios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my", { withCredentials: true })
      .then(res => setOrders(res.data.orders));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.map(order => (
        <div key={order._id} className="border p-4 rounded mb-3">
          <p>Order ID: {order._id}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.orderStatus}</p>
        </div>
      ))}
    </div>
  );
}
