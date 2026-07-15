import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const {token, setToken, navigate, backend} = useContext(ShopContext);
  const [name,setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {

      //Sign Up Logic
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backend}/api/user/register`, {name,email,password});
        if(response.data.success){
          toast.success("Sign Up Successfully");
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token);
        }
        else{
          toast.error(response.data.message)
        }
      }
      //Login Logic 
      else {
        const response = await axios.post(`${backend}/api/user/login`, {email,password});
        if(response.data.success){
          toast.success("Sign Up Successfully");
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token)
        }
        else{
          toast.error(response.data.message)
        }

      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/');
    }
  },[token])

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      {/* Title */}
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {/* Name – only shown on Sign Up */}
      {currentState === 'Login' ? '' : (
        <input
          type='text'
          value={name}
          onChange={(e)=> setName(e.target.value)}
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Name'
          required
        />
      )}

      {/* Email */}
      <input
        type='email'
        value={email}
        onChange={(e)=> setEmail(e.currentTarget.value)}
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
      />

      {/* Password */}
      <input
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Password'
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        required
      />

      {/* Forgot password & toggle link */}
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer underline hover:text-blue-700'>Forgot password?</p>
        {currentState === 'Login'
          ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-blue-700'>Create account</p>
          : <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-blue-700'>Login Here</p>
        }
      </div>

      {/* Submit button */}
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>

    </form>
  )
}

export default Login
