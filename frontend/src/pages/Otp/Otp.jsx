import React from 'react';
import './Otp.css';
import { useNavigate } from 'react-router-dom';

const Otp = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  }
  return (
    <div className='otp-popup'>
      <form className="otp-popup-container" onSubmit={handleSubmit}>
        <div className="otp-popup-title">
          <h2>Enter OTP</h2>
        </div>
        <div className="otp-popup-input">
          <input type="text" placeholder='Enter OTP' required />
        </div>
        <button>Verify</button>
        <p className='otp-redirect'>Didn’t receive an OTP? <span>Resend OTP</span></p>
      </form>
    </div>
  );
};

export default Otp;
