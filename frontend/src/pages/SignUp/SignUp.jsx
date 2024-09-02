import React from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/login')
  }
  return (
    <div className='signup-popup'>
      <form className="signup-popup-container" onSubmit={handleSubmit}>
        <div className="signup-popup-title">
            <h2>Sign Up</h2>
        </div>
        <div className="signup-popup-input">
            <input type="text" placeholder='Your name' required />
            <input type="email" placeholder='Your email' required />
            <input type="password" placeholder='Your password' required />
        </div>
        <button>Create account</button>
        <p className='signup-redirect'>Already have an account? <span onClick={() => { navigate('/login') }}>Login</span></p>
      </form>
    </div>
  );
};

export default SignUp;
