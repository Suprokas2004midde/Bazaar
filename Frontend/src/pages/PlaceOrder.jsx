import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'

const PlaceOrder = () => {
  const {navigate} = useContext(ShopContext);
  const [method, setMethod] = useState('cod')

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* ------------- Left Side – Delivery Information ------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {/* First Name & Last Name */}
        <div className='flex gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='First name'
          />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Last name'
          />
        </div>

        {/* Email */}
        <input
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='email'
          placeholder='Email address'
        />

        {/* Street */}
        <input
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='text'
          placeholder='Street'
        />

        {/* City & State */}
        <div className='flex gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='City'
          />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='State'
          />
        </div>

        {/* Zipcode & Country */}
        <div className='flex gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='number'
            placeholder='Zipcode'
          />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Country'
          />
        </div>

        {/* Phone */}
        <input
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='number'
          placeholder='Phone'
        />
      </div>

      {/* ------------- Right Side ------------- */}
      <div className='mt-8'>

        {/* Cart Totals */}
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        {/* Payment Method Selection */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='flex gap-3 flex-col lg:flex-row'>

            {/* Stripe */}
            <div
              onClick={() => setMethod('stripe')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'stripe' ? 'border-green-400' : 'border-gray-200'}`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <span className='text-blue-600 font-semibold text-sm tracking-wide italic mx-4'>stripe</span>
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod('razorpay')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'razorpay' ? 'border-green-400' : 'border-gray-200'}`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <span className='text-[#072654] font-bold text-sm mx-4'>
                <span className='text-[#2c9ef4]'>&#9632;</span>Razorpay
              </span>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'cod' ? 'border-green-400' : 'border-gray-200'}`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>

          </div>
        </div>

        {/* Place Order Button */}
        <div className='w-full text-end mt-8'>
          <button className='bg-black text-white px-16 py-3 text-sm active:bg-gray-700' onClick={()=>navigate('/orders')}>
            PLACE ORDER
          </button>
        </div>

      </div>
    </div>
  )
}

export default PlaceOrder
