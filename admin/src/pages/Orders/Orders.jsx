import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
        const initialStatus = response.data.data.reduce((acc, order, index) => {
          acc[index] =
            localStorage.getItem(`orderStatus-${order._id}`) ||
            order.status ||
            "Food Processing";
          return acc;
        }, {});
        setOrderStatus(initialStatus);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (e, index, orderId) => {
    const status = e.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status,
      });

      if (response.data.success) {
        setOrderStatus((prevState) => {
          const newState = { ...prevState, [index]: status };
          localStorage.setItem(`orderStatus-${orderId}`, status);
          return newState;
        });
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const formatDateTime = (date) => {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedDate = new Date(date).toLocaleDateString(
      "en-US",
      optionsDate
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      "en-US",
      optionsTime
    );
    return { formattedDate, formattedTime };
  };

  const groupOrdersByDate = (orders) => {
    return orders.reduce((groups, order) => {
      const { formattedDate } = formatDateTime(order.date);
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(order);
      return groups;
    }, {});
  };

  const groupedOrders = groupOrdersByDate(orders);

  const getOrderStatusBackground = (status) => {
    switch (status) {
      case "Out for delivery":
        return "yellow";
      case "Delivered":
        return "lightgreen";
      case "Cancelled":
        return "lightcoral";
      default:
        return "white";
    }
  };

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <hr className="order-hr" />
      <div className="order-list">
        {Object.keys(groupedOrders).length > 0 ? (
          Object.keys(groupedOrders).map((date, index) => (
            <div key={index} className="order-group">
              <h3>{date}</h3>
              {groupedOrders[date].map((order, orderIndex) => {
                const { formattedTime } = formatDateTime(order.date);
                return (
                  <div
                    className={`order-item ${orderStatus[orderIndex]}`}
                    key={orderIndex}
                    style={{
                      backgroundColor: getOrderStatusBackground(
                        orderStatus[orderIndex]
                      ),
                    }}
                  >
                    <i className="fa-solid fa-box"></i>
                    <div>
                      <table className="order-items-table">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <p className="order-item-name">
                        {order.address.firstName + " " + order.address.lastName}
                      </p>

                      <div className="order-item-address">
                        <p>{order.address.street + ", "}</p>
                        <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                      </div>

                      <p className="order-item-phone">{order.address.phone}</p>
                    </div>
                    <p className="time-bold">{formattedTime}</p> 
                    <p className="details">Items: {order.items.length}</p>
                    <p className="details">Amount : <span className="amount-color">{order.amount}</span></p>
                    <select
                      value={orderStatus[orderIndex] || "Food Processing"}
                      onChange={(e) =>
                        handleStatusChange(e, orderIndex, order._id)
                      }
                      className={
                        orderStatus[orderIndex] === "Out for delivery"
                          ? "out"
                          : orderStatus[orderIndex] === "Delivered"
                          ? "delivered"
                          : orderStatus[orderIndex] === "Cancelled"
                          ? "cancelled"
                          : "processing"
                      }
                    >
                      <option value="Food Processing" className="processing">
                        Food Processing
                      </option>
                      <option value="Out for delivery" className="out">
                        Out for delivery
                      </option>
                      <option value="Delivered" className="delivered">
                        Delivered
                      </option>
                      <option value="Cancelled" className="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
