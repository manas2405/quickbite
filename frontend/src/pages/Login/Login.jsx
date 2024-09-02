import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); 
    navigate('/otp');
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>Login</h2>
        </div>
        <div className="login-popup-input">
          <input type="email" placeholder='Your email' required />
          <input type="password" placeholder='Your password' required />
        </div>
        <button type="submit">Login</button>
        <p className='login-redirect'>
          Create a new account?{' '}
          <span onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
