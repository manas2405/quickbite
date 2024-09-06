import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { sentOtpFunction } from "../../services/Api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Enter email or password !");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !");
    } else {
      const data = { email };
      try {
        const response = await sentOtpFunction(data);
        if (response.status === 200) {
          toast.success("Otp sent successfully.")
          navigate("/user/otp", { state: email });
        } else {
          toast.error(response.response.data.error);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={sendOtp}>
        <div className="login-popup-title">
          <h2>Login</h2>
        </div>
        <div className="login-popup-input">
          <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Your email' required />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Your password' required />
        </div>
        <button type="submit">Login</button>
        <p className='login-redirect'>
          Create a new account?{' '}
          <span onClick={() => navigate('/register')}>Sign Up</span>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
