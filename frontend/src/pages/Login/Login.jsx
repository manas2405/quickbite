import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-heading">Welcome Back!</h2>
          <form className="login-form">
            <div className="input-group">
              <label className="input-label" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="input-field"
                placeholder="Enter your username"
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Enter your password"
              />
            </div>
            <div className="form-footer">
              <Link to='/'>
                <button className="login-button" type="button">
                  Sign In
                </button>
              </Link>
              <Link className="forgot-password" to="#">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
