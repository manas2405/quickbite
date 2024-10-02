import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

import "./Verify.css";
const Verify = () => {
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found for verification.");
      return;
    }
    try {
      const response = await axios.post(
        `${url}/api/order/verify`,
        { success, orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from backend:", response.data);
      if (response.data.success) {
        setTimeout(() => {
          navigate("/myorders");
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);
  return (
    <div className="verify-page">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
