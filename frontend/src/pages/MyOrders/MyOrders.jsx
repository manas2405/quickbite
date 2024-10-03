import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./MyOrders.css";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <i className="fa-solid fa-box"></i>
              <p>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx !== order.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p>Rs. {order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span className='bullet'>&#x25cf;</span><b> {order.status}</b></p>
              <button onClick={fetchOrders()}>Track order</button>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
