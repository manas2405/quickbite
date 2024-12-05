import { useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./PaymentForm.css"

const PaymentForm = ({ orderData, onSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { url } = useContext(StoreContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { data } = await axios.post(
        `${url}/api/stripe/create-payment-intent`,
        {
          amount: orderData.amount * 100,
        }
      );

      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${orderData.firstName} ${orderData.lastName}`,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
        onSubmit(false);
        return;
      }

      const verifyResponse = await axios.post(
        `${url}/api/stripe/confirm-payment`,
        {
          paymentIntentId: result.paymentIntent.id,
          orderId: orderData.orderId,
        }
      );

      if (verifyResponse.data.success) {
        toast.success("Order placed successfully!");
        onSubmit(true);
      } else {
        toast.error("Payment verification failed");
        onSubmit(false);
      }
    } catch (error) {
      toast.error("Payment processing failed");
      onSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2 className="payment-form__title">Payment</h2>

      <div className="payment-form__fields">
        <label>
          Card Details
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
              hidePostalCode: true,
            }}
          />
        </label>
      </div>

      <button type="submit" disabled={!stripe} className="payment-form__submit">
        Pay Now
      </button>
    </form>
  );
};

export default PaymentForm;
