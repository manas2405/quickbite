import  { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import "./PlaceOrder.css";

const stripePromise = loadStripe(
  "pk_test_51Pxo1aRs1w1em1HoM0gjfK4jtRV6QTcMkaQT38w5OhrHjYqFRXYV6pgk1uz4T5LyvdmgOcdLQnKHSboqf1tRdrIz00O4zxUfTb"
);

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false);
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      userId: token ? JSON.parse(atob(token.split(".")[1]))._id : null,
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 30,
    };

    if (orderData.amount * 100 < 3750) {
      toast.error("Minimum order amount must be at least ₹37.50.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Proceeding to payment...");
        setIsPaymentFormVisible(true);
      } else {
        toast.error(response.data.message || "Error placing the order");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  const handlePaymentSuccess = (success) => {
    if (success) {
      navigate("/myorders");
    } else {
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <>
      {!isPaymentFormVisible ? (
        <form className="place-order" onSubmit={placeOrder}>
          <div className="place-order-left">
            <p className="title">Delivery Information</p>
            <div className="multi-fields">
              <input
                required
                name="firstName"
                onChange={onChangeHandler}
                value={data.firstName}
                type="text"
                placeholder="First Name"
              />
              <input
                required
                name="lastName"
                onChange={onChangeHandler}
                value={data.lastName}
                type="text"
                placeholder="Last Name"
              />
            </div>
            <input
              required
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="text"
              placeholder="Email address"
            />
            <input
              required
              name="street"
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder="Street"
            />
            <div className="multi-fields">
              <input
                required
                name="city"
                onChange={onChangeHandler}
                value={data.city}
                type="text"
                placeholder="City"
              />
              <input
                required
                name="state"
                onChange={onChangeHandler}
                value={data.state}
                type="text"
                placeholder="State"
              />
            </div>
            <div className="multi-fields">
              <input
                required
                name="zipcode"
                onChange={onChangeHandler}
                value={data.zipcode}
                type="text"
                placeholder="Zip code"
              />
              <input
                required
                name="country"
                onChange={onChangeHandler}
                value={data.country}
                type="text"
                placeholder="Country"
              />
            </div>
            <input
              required
              type="text"
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              placeholder="Mobile number"
            />
          </div>
          <div className="place-order-right">
            <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>Rs. {getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>Rs. {getTotalCartAmount() === 0 ? 0 : 30}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>
                    Rs.{" "}
                    {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 30}
                  </b>
                </div>
              </div>
              <button type="submit">Proceed to payment</button>
            </div>
          </div>
        </form> 
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentForm
            orderData={{ ...data, amount: getTotalCartAmount() + 30 }}
            onSubmit={handlePaymentSuccess}
            url={url}
          />
        </Elements>
      )}
    </>
  );
};

export default PlaceOrder;
