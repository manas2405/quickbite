import React, { useState } from 'react'
import './LoginPopup.css'

const LoginPopup = ({setShowLogin}) => {

  const [currState, setCurrState] = useState("Login")
  return (
    <div className='login-popup'>
      <form className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <i className='fa-solid fa-xmark' onClick={() => {setShowLogin(false)}} ></i>
        </div>
        <div className="login-popup-input">
            {currState === 'Login' ? <></> : <input type="text" placeholder='Your name' required />}
            <input type="email" placeholder='Your email' required />
            <input type="password" placeholder='Your password' required />
        </div>
        <button>{currState === 'Sign Up' ? 'Create account' : 'Login' }</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>I agree to terms & privacy policy</p>
        </div>

        {currState === 'Login' ? <p>Create a new account ? <span onClick={() => {setCurrState("Sign Up")}}>Sign Up</span></p> : <p>Already have an account ? <span onClick={() => {setCurrState("Login")}}>Login</span></p>}
      </form>
    </div>
  )
}

export default LoginPopup
