import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BsCartCheck } from "react-icons/bs";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import logo from "../assets/logo.png";

const Navbar = () => {

    const [visible,setvisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img
          src={logo}
          alt="Brand_logo"
          className="w-32 sm:w-40 md:w-45 cursor-pointer"
        />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col gap-1 items-center">
          <p>HOME</p>
          <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col gap-1 items-center">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col gap-1 items-center">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col gap-1 items-center">
          <p>CONTACTS</p>
          <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
        </NavLink>
      </ul>

      <div className="flex flex-row gap-3 sm:gap-6 items-center">
        <div>
          <IoSearch className="cursor-pointer" />
        </div>
        <div className="group relative">
          <CgProfile className="cursor-pointer" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 px-5 py-3 bg-slate-100 text-gray-500">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Link to="/">
            <BsCartCheck className="w-5 min-w-5" />
            <p className="absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              9
            </p>
          </Link>
        </div>
        <HiMenuAlt3
          onClick={() => setvisible(true)}
          className="cursor-pointer sm:hidden"
        />
      </div>

      {/*This is for drop down menu */}

      <div
        className={`absolute top-0 right-0 bottom-auto  overflow-hidden bg-black transition-all ${visible ? "w-50" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setvisible(false)}
            className="flex items-center gap-4 p-3 "
          >
            <IoArrowBack />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setvisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
