import React, { useContext } from 'react'
import {Link} from "react-router"
import { ShopContext } from '../context/ShopContext';


const ProductItem = ({item}) => {
    const {CurrencySym} = useContext(ShopContext);
    const currency = CurrencySym;
  return (
    <div className='border p-2'>
      <Link to={`/product/${item._id}`} className='text-gray-700 cursor-pointer' >
        <div className='overflow-hidden'>
            <img src={item.image[0]} alt="" className='hover:scale-110 transition ease-in-out'/>
        </div>
        <p className='pt-3 pb-1 text-sm'>{item.name}</p>
        <p className='text-sm font-medium'>{currency}{item.price}</p>
      </Link>
    </div>
  )
}

export default ProductItem
