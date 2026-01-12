import { useEffect, useState } from "react";
import api from "../api/Azios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/orders/my")
      .then(res => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0) return <p>No orders yet</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map(order => (
        <div key={order._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Total:</b> Rs {order.totalAmount}</p>
          <p><b>Status:</b> {order.orderStatus}</p>
          <p><b>Date:</b> {new Date(order.createdAt).toDateString()}</p>

          <hr />

          {order.items.map(item => (
            <div key={item.product} style={{ display: "flex", gap: 10 }}>
              <img src={item.image} alt="" width={50} />
              <p>{item.title} × {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
