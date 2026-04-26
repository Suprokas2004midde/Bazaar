import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { IoSearch } from "react-icons/io5";
import { useLocation } from "react-router";

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname.includes('collection')){
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    },[location]);



  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex justify-center items-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="flex-1 bg-inherit outline-none text-sm "
          type="text"
          placeholder="Search"
        />
        <IoSearch className="w-4"/>
      </div>
    </div>
  ): null;
};

export default SearchBar;
