import React, { useState } from 'react'
import './NavBar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const NavBar = () => {

  const [menu, setMenu] = useState("Menu")

  return (
    <div className='navbar'>
      <Link to='/' ><h1 className='logo' alt="">QuickBite</h1></Link>
      <ul className='navbar-menu'>
        <Link to='/' ><li onClick={() => {setMenu("Home")}} className={menu==="Home" ? "active" : "" }>Home</li></Link>
        <Link to='/' ><li onClick={() => {setMenu("Menu")}} className={menu==="Menu" ? "active" : ""}>Menu</li></Link>
        <Link to='/' ><li onClick={() => {setMenu("Mobile-app")}} className={menu==="Mobile-app" ? "active" : ""}>Mobile app</li></Link>
        <Link to='/' ><li onClick={() => {setMenu("Contact-us")}} className={menu==="Contact-us" ? "active" : ""}>Contact us</li></Link>
      </ul>

      <div className='navbar-right'>
        <img src={assets.search_icon} alt="" />
        <div className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className='dot'></div>
        </div>
        <Link to='/login' ><button onClick={() => {setShowLogin(true)}}>Sign in</button></Link>
      </div>
    </div>
  )
}

export default NavBar
