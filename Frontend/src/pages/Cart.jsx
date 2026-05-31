import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ShowCartItems from '../components/ShowCartItems';
import CartTotal from '../components/CartTotal';


const Cart = () => {
  const { cartItems, CurrencySym, productsDummyData, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([])

  useEffect(()=>{
      let tempData = [];
      for(const items in cartItems){
        for(const item in cartItems[items]){
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
      setCartData(tempData)
  },[cartItems])
  return (
    <div>
      <ShowCartItems cartData={cartData} />
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          <div className='w-full text-end'>
            <button className='bg-black text-white text-sm py-3 my-8 px-8' onClick={()=>navigate('/place-order')}>PROCEED TO CHECKOUT</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart
