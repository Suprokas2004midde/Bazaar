import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { bestSeller, orderDummyData } from "../assets/asset";
import { useNavigate } from "react-router";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const CurrencySym = "₹";
  const DeliveryFees = 50;
  const backend = import.meta.env.VITE_BACKEND_SERVER;
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    // Find the product to check if it requires a size
    const product = productsData.find((p) => p._id === itemId);

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

    //updating the new added product to the main db ONLY IF a TOKEN exist...
    if (token) {
      try {
        await axios.post(
          `${backend}/api/cart/add`,
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        totalCount += cartItems[items][item];
      }
    }
    return totalCount;
  };

  const getTotalAmount = () => {
    let TotalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = productsData.find((products) => products._id === items);
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          TotalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return TotalAmount;
  };

  //Called from ShowCartItems component
  const updateCart = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        //Object.kes returns an array here --> ['M','S'] etc
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);

    //updating the new added product to the main db ONLY IF a TOKEN exist...
    if (token) {
      try {
        await axios.post(
          `${backend}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }, //This header token is required for userAuthentication
        );
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${backend}/api/product/list`);
      if (response.data.success) {
        setProductsData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        //in get request there is no header section
        `${backend}/api/cart/get`,
        {},
        { headers: { token } },
      ); 
      setCartItems(response.data.data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductData();
    //If token available in the local storage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, []);

  const value = {
    loading,
    productsData,
    CurrencySym,
    DeliveryFees,
    showSearch,
    setShowSearch,
    search,
    setSearch,
    cartItems,
    addToCart,
    getCartCount,
    setCartItems,
    updateCart,
    getTotalAmount,
    navigate,
    backend,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
