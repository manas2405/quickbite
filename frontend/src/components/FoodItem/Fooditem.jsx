import React, { useContext, useState } from "react";
import "./Fooditem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import FoodPopUp from "../FoodPopUp/FoodPopUp";

const Fooditem = ({ id, name, price, description, image, category, ratingStars }) => {
  const { cartItems = {}, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [selectedItem, setSelectedItem] = useState(null);

  const openPopUp = () => {
    setSelectedItem({
      id,
      name,
      price,
      description,
      image: url + "/images/" + image,
      category,
      ratingStars,
    });
  };

  const closePopUp = () => setSelectedItem(null);

  return (
    <>
      <div className="food-item" onClick={openPopUp}>
        <div className="food-item-image-container">
          <img className="food-item-image" src={url + "/images/" + image} alt="" />
          {!cartItems[id] ? (
            <img
              className="add"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id);
              }}
              src={assets.add_icon_white}
              alt="..."
            />
          ) : (
            <div className="food-item-counter">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(id);
                }}
                src={assets.remove_icon_red}
                alt=""
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(id);
                }}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )}
        </div>

        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
          </div>

          <p className="food-item-description">{description}</p>
          <p className="food-item-price">Rs {price}</p>
        </div>
      </div>

      {selectedItem && <FoodPopUp item={selectedItem} onClose={closePopUp} />}
    </>
  );
};

export default Fooditem;
