import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'

import { FaListUl } from "react-icons/fa6";
import { MdAddCircleOutline } from "react-icons/md";
import { LuShoppingBag } from "react-icons/lu";

const Sidebar = () => {

  return (
    <aside className="w-[18%] min-h-screen border-r border-gray-200 bg-white">
      <div className="flex flex-col gap-1 pt-6 pl-[20%] text-[15px]">

        {/* Add Items */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-md
             cursor-pointer transition-all duration-150
             ${isActive ? "active" : "hover:bg-gray-50 text-gray-700"}`
          }
        >
          <MdAddCircleOutline  className="w-6 h-6" />
          <p className="hidden md:block font-medium">Add Items</p>
        </NavLink>

        {/* List Items */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-md
             cursor-pointer transition-all duration-150
             ${isActive ? "active" : "hover:bg-gray-50 text-gray-700"}`
          }
        >
          <FaListUl className="w-5 h-5" />
          <p className="hidden md:block font-medium">List Items</p>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l-md
             cursor-pointer transition-all duration-150
             ${isActive ? "active" : "hover:bg-gray-50 text-gray-700"}`
          }
        >
          <LuShoppingBag className='w-6 h-6'/>
          <p className="hidden md:block font-medium">Orders</p>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar
