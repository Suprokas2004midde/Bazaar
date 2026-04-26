import { createContext, useState } from "react";
import { productsDummyData, bestSeller } from "../assets/asset";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const CurrencySym = "₹";
  const DeliveryFees = 50;
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const value = {
    productsDummyData,
    CurrencySym,
    DeliveryFees,
    bestSeller,
    showSearch,
    setShowSearch,
    search,
    setSearch,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
