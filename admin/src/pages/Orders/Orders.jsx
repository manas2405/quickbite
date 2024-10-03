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
          acc[index] = localStorage.getItem(`orderStatus-${order._id}`) || order.status || "Food Processing";
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

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div className={`order-item ${orderStatus[index]}`} key={index}>
            <i className="fa-solid fa-box"></i>
            <div>
              <p className="order-item-food">
                {order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>

              <div className="order-item-address">
                <p>{order.address.street + ", "}</p>
                <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
              </div>

              <p className="order-item-phone">{order.address.phone}</p>
            </div>

            <p>Items : {order.items.length}</p>
            <p>Amount : {order.amount}.00</p>

            <select
              value={orderStatus[index] || "Food Processing"}
              onChange={(e) => handleStatusChange(e, index, order._id)}
              className={
                orderStatus[index] === "Out for delivery"
                  ? "out"
                  : orderStatus[index] === "Delivered"
                  ? "delivered"
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
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
