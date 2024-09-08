import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

const SignUp = () => {
  const [passhow, setPassShow] = useState(false);
  const [spiner,setSpinner] = useState(false);
  const navigate = useNavigate();
  const [inputdata, setInputdata] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = inputdata;

    // Input validation
    if (name === "") {
      toast.error("Enter Your Name");
    } else if (email === "") {
      toast.error("Enter Your Email");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email");
    } else if (password === "") {
      toast.error("Enter Your Password");
    } else if (password.length < 8) {
      toast.error("Password length minimum 8 characters");
    } else {
      setSpinner(true);
      try {
        const response = await axios.post(`http://localhost:4000/api/user/register`, inputdata);  // API call to register

        if (response.status === 200) {
          setInputdata({ name: "", email: "", password: "" });
          toast.success("User registered successfully.");
          setTimeout(() => {
            navigate("/login");
          }, 3000)
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className='signup-popup'>
      <form className="signup-popup-container" onSubmit={handleSubmit}>
        <div className="signup-popup-title">
          <h2>Sign Up</h2>
        </div>
        <div className="signup-popup-input">
          <input type="text" name="name" onChange={handleChange} value={inputdata.name} placeholder='Your name' required />
          <input type="email" name="email" onChange={handleChange} value={inputdata.email} placeholder='Your email' required />
          <div className="password-container">
            <input type={!passhow ? "password" : "text"} name="password" onChange={handleChange} value={inputdata.password} placeholder='Your password' required />
            <div className='showpass' onClick={() => setPassShow(!passhow)}>
              {!passhow ? "Show" : "Hide"}
            </div>
          </div>
        </div>
        <button type="submit">Create account
        {
        spiner ? <span><Spinner animation="border" /></span>:""
        }
        </button>
        <p className='signup-redirect'>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
