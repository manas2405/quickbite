import React, { useRef } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);

  const scroll = (direction) => {
    const { current } = menuRef;
    const scrollAmount = 50; 
    const scrollOptions = {
      left: direction === 'left' ? current.scrollLeft - scrollAmount : current.scrollLeft + scrollAmount,
      behavior: 'smooth',
    };
    current.scrollTo(scrollOptions);
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with finest ingredients culinary expertise. Our mission is to
        satisfy your cravings and elevate your dining experience, one delicious
        meal at a time.
      </p>
      <div className='explore-menu-container'>
        <button className='scroll-arrow left' onClick={() => scroll('left')}>
          &#10094;
        </button>
        <div className='explore-menu-list' ref={menuRef}>
          {menu_list.map((item, index) => (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? 'All' : item.menu_name
                )
              }
              key={index}
              className='explore-menu-list-item'
            >
              <img
                className={category === item.menu_name ? 'active' : ''}
                src={item.menu_image}
                alt=''
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <button className='scroll-arrow right' onClick={() => scroll('right')}>
          &#10095;
        </button>
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
