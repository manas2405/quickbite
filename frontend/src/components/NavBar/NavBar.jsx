import { useContext, useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const NavBar = () => {
  const [menu, setMenu] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="navbar">
      <Link to="/">
        <h1 className="logo">QuickBite</h1>
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => setMenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          <Link to="/">Home</Link>
        </li>
        <li
          onClick={() => setMenu("Menu")}
          className={menu === "Menu" ? "active" : ""}
        >
          <a href="#explore-menu">Menu</a>
        </li>
        <li
          onClick={() => setMenu("Mobile-app")}
          className={menu === "Mobile-app" ? "active" : ""}
        >
          <a href="#app-download">Mobile app</a>
        </li>
        <li
          onClick={() => setMenu("Contact-us")}
          className={menu === "Contact-us" ? "active" : ""}
        >
          <a href="#footer">Contact us</a>
        </li>
      </ul>

      <div className="navbar-right">
        <i className="fa-solid fa-magnifying-glass"></i>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!isLoggedIn ? (
          <button className="signin"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <i className="fa-solid fa-user"></i>
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}

        <i className="fa-solid fa-bars hamburger-menu" onClick={toggleMenu}></i>

        {isMenuOpen && (
          <ul className="navbar-dropdown">
            <li
              onClick={() => {
                setMenu("Home");
                toggleMenu();
              }}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              onClick={() => {
                setMenu("About");
                toggleMenu();
              }}
            >
              <a href="#about">About</a>
            </li>
            <li
              onClick={() => {
                setMenu("Menu");
                toggleMenu();
              }}
            >
              <a href="#explore-menu">Explore Menu</a>
            </li>
            <li
              onClick={() => {
                setMenu("Contact-us");
                toggleMenu();
              }}
            >
              <a href="#footer">Contact us</a>
            </li>
            {!isLoggedIn ? (
              <li
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
              >
                Login
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NavBar;
