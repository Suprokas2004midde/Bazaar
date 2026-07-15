import React from "react";
import {Link} from 'react-router-dom'
import { assets } from "../assets/assets.js";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between border-b border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex flex-col leading-none">
        <Link to="/">
          <img
            className="w-28 sm:w-36 md:w-40 cursor-pointer"
            src={assets.Bazaar_logo}
            alt="logo"
          />
        </Link>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setToken("")}
        className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full 
                   hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
