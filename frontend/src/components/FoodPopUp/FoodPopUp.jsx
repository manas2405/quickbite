import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import "./FoodPopUp.css";

const FoodPopUp = ({ item, onClose }) => {
  const { addToCart, removeFromCart, cartItems } = useContext(StoreContext);

  if (!item) return null;

  return (
    <div className="food-popup-overlay">
      <div className="food-popup-box">
        <button className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-x"></i>
        </button>
        <div className="food-popup-content">
          <div className="food-popup-image-container">
            <img
              className="food-popup-image"
              src={item.image}
              alt={item.name}
            />
          </div>
          <div className="food-popup-info">
            <h2 className="food-popup-name">{item.name}</h2>
            <p className="food-popup-category">{item.category}</p>
            <p className="food-popup-description">{item.description}</p>
            <h3 className="food-popup-price">Rs {item.price}</h3>
            <div className="food-popup-rating">
              <img src={assets.rating_starts} alt="Rating" />
            </div>

            {!cartItems[item.id] ? (
              <div className="food-popup-buttons">
                <button
                  className="cart-button"
                  onClick={() => addToCart(item.id)}
                >
                  Add to cart
                </button>
                <button className="back-btn" onClick={onClose}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            ) : (
              <div className="food-popup-counter">
                <button className="minus" onClick={() => removeFromCart(item.id)}>-</button>
                <p>{cartItems[item.id]}</p>
                <button className="plus" onClick={() => addToCart(item.id)}>+</button>
                <button className="back-btn" onClick={onClose}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPopUp;
