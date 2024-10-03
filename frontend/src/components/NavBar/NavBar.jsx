import React, { useContext, useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const NavBar = () => {
  const [menu, setMenu] = useState("Home");
  const navigate = useNavigate();
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  return (
    <div className="navbar">
      <Link to="/">
        <h1 className="logo" alt="">
          QuickBite
        </h1>
      </Link>
      <ul className="navbar-menu">
        <Link to="/">
          <li
            onClick={() => {
              setMenu("Home");
            }}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </li>
        </Link>
        <a href="#explore-menu">
          <li
            onClick={() => {
              setMenu("Menu");
            }}
            className={menu === "Menu" ? "active" : ""}
          >
            Menu
          </li>
        </a>
        <a href="#app-download">
          <li
            onClick={() => {
              setMenu("Mobile-app");
            }}
            className={menu === "Mobile-app" ? "active" : ""}
          >
            Mobile app
          </li>
        </a>
        <a href="#footer">
          <li
            onClick={() => {
              setMenu("Contact-us");
            }}
            className={menu === "Contact-us" ? "active" : ""}
          >
            Contact us
          </li>
        </a>
      </ul>

      <div className="navbar-right">
        <i className="fa-solid fa-magnifying-glass"></i>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <i className="fa-solid fa-user"></i>
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li> 
              <hr /> 
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
