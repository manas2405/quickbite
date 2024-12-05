import NavBar from './components/NavBar/NavBar'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Otp from './pages/Otp/Otp'
import Verify from './pages/Verify/Verify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyOrders from './pages/MyOrders/MyOrders'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Pxo1aRs1w1em1HoM0gjfK4jtRV6QTcMkaQT38w5OhrHjYqFRXYV6pgk1uz4T5LyvdmgOcdLQnKHSboqf1tRdrIz00O4zxUfTb');

function App() {  
  return (
    <>
      <div className='app'>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/order" 
            element={
              <Elements stripe={stripePromise}>
                <PlaceOrder />
              </Elements>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myOrders" element={<MyOrders />} />
        </Routes>
        <ToastContainer />
      </div>
      <Footer />
    </>
  )
}

export default App
