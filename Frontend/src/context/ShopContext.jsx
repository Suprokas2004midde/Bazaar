import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { productsDummyData, bestSeller, orderDummyData } from "../assets/asset";
import { useNavigate } from "react-router";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const CurrencySym = "₹";
  const DeliveryFees = 50;
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();


  const addToCart = async (itemId, size) => {
    
    // Find the product to check if it requires a size
    const product = productsDummyData.find((p) => p._id === itemId);

    // If the product has sizes but no size was selected, alert the user
    if (product && product.sizes && product.sizes.length > 0 && !size) {
      toast.warning("Please select a size before adding to cart.");
      return;
    }

    // Use "ONE_SIZE" as the key for products that don't have size options
    const sizeKey = product && product.sizes ? size : "ONE_SIZE";

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][sizeKey]) {
        cartData[itemId][sizeKey] += 1;
      } else {
        cartData[itemId][sizeKey] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][sizeKey] = 1;
    }
    setCartItems(cartData);
  }

  const getCartCount = ()=>{
    let totalCount = 0;
    for(const items in cartItems){
      for(const item in cartItems[items]){
        totalCount += cartItems[items][item]
      }
    }
    return totalCount;
  }

  const getTotalAmount = ()=>{
    let TotalAmount = 0;
    for(const items in cartItems){
      let itemInfo = productsDummyData.find((products)=> products._id === items);
      for(const item in cartItems[items]){
        if(cartItems[items][item] > 0){
          TotalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return TotalAmount;
  }

  const updateCart = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {  //Object.kes returns an array here --> ['M','S'] etc 
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
  }

  // useEffect(()=>{
  //   console.log(cartItems);
  //   console.log(getTotalAmount());
  // },[cartItems])

  const value = {
    productsDummyData,
    orderDummyData,
    CurrencySym,
    DeliveryFees,
    bestSeller,
    showSearch,
    setShowSearch,
    search,
    setSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateCart,
    getTotalAmount,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
