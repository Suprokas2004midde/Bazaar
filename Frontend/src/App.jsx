import { useState } from 'react'
import { Routes, Route } from 'react-router';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Collection from './pages/Collection.jsx';
import Login from './pages/Login.jsx'; 
import ProductDetail from './pages/ProductDetail.jsx';
import Orders from './pages/Orders.jsx';
import Contacts from './pages/Contacts.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import About from './pages/About.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SearchBar from "./components/SearchBar.jsx";
import OrderDetails from './pages/OrderDetails.jsx';
import Profile from './pages/Profile.jsx';
import Address from './pages/Address.jsx';
import Wishlist from './pages/Wishlist.jsx';

function App() {

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:productID" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track/:orderID" element={<OrderDetails />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/about" element={<About />} />
        <Route path='/profile' element={ <Profile/> }/>
        <Route path='/address' element={<Address/>} />
        <Route path='/wishlist' element={<Wishlist/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
