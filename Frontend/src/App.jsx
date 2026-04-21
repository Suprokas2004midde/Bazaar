import { useState } from 'react'
import { Routes,Route } from 'react-router';
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

function App() {

  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24'>
      <Navbar/>
      <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='/cart' element={ <Cart/> } />
        <Route path='/collection'  element={ <Collection/> } />
        <Route path='/login' element={ <Login/> } />
        <Route path='/product/:productID' element={ <ProductDetail/> } />
        <Route path='orders' element={ <Orders/> } />
        <Route path='contact' element={ <Contacts/> } />
        <Route path='place-order' element={ <PlaceOrder/> } />
        <Route path='about' element={<About/>} />
      </Routes>      
    </div>
  );
}

export default App
