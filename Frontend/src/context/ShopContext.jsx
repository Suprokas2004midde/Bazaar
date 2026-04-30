import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { productsDummyData, bestSeller } from "../assets/asset";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const CurrencySym = "₹";
  const DeliveryFees = 50;
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState({});


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

  useEffect(()=>{
    console.log(cartItems);
  },[cartItems])

  const value = {
    productsDummyData,
    CurrencySym,
    DeliveryFees,
    bestSeller,
    showSearch,
    setShowSearch,
    search,
    setSearch,
    cartItems,
    addToCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
