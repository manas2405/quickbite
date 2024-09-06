import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <>
      <div className='navbar'>
        <h1 className='logo'>QuickBite</h1>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
      <div className='admin-panel'>
        <p>Admin Panel</p>
      </div>
    </>
  )
}

export default Navbar
