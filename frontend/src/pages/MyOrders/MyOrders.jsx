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

      const orders = response.data.data || [];

      // Sort the orders by date in descending order (latest first)
      const sortedOrders = orders.sort((a, b) => {
        const dateA = new Date(a.date);  // Assuming 'date' is the order date field
        const dateB = new Date(b.date);
        return dateB - dateA;  // This sorts in descending order
      });

      setData(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const groupOrdersByDate = (orders) => {
    return orders.reduce((groups, order) => {
      const orderDate = formatDate(order.date);
      if (!groups[orderDate]) {
        groups[orderDate] = [];
      }
      groups[orderDate].push(order);
      return groups;
    }, {});
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const groupedOrders = groupOrdersByDate(data);

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Food Processing":
        return "white"; 
      case "Out for delivery":
        return "lightyellow";
      case "Delivered":
        return "lightgreen"; 
      case "Cancelled":
        return "lightcoral"; 
      default:
        return "white"; 
    }
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <hr />
      <div className="container">
        {Object.keys(groupedOrders).length > 0 ? (
          Object.keys(groupedOrders).map((date, index) => (
            <div key={index} className="order-group">
              <h4 className='order-date'>{date}</h4>
              {groupedOrders[date].map((order, orderIndex) => (
                <div
                  key={orderIndex}
                  className="my-orders-order"
                  style={{ backgroundColor: getStatusBackgroundColor(order.status) }} 
                >
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
                  <button onClick={fetchOrders}>Track order</button>
                </div>
              ))}
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
