import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar  from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login   from './components/Login'

import Add    from './pages/Add'
import List   from './pages/List'
import Orders from './pages/Orders'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token)
    } else {
      localStorage.removeItem('adminToken')
    }
  }, [token])

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />

      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr className="border-gray-200" />
          <div className="flex w-full">
            <Sidebar />
            <main className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/"       element={<Navigate to="/add" replace />} />
                <Route path="/add"    element={<Add    token={token} />} />
                <Route path="/list"   element={<List   token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="*"       element={<Navigate to="/add" replace />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  )
}

export default App
