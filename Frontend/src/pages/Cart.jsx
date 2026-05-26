import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ShowCartItems from '../components/ShowCartItems';


const Cart = () => {
  const { cartItems, CurrencySym, productsDummyData } = useContext(ShopContext);
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
      <ShowCartItems cartData={cartData} setCartData={setCartData}/>
    </div>
  )
}

export default Cart
