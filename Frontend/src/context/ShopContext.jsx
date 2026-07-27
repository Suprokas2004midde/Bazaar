import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const CurrencySym = "₹";
  const DeliveryFees = 50;
  const backend = import.meta.env.VITE_BACKEND_SERVER;

  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});
  const [cartProductsData, setCartProductsData] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [LatestCollection, setLatestCollection] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const fetchCartProductsDetails = async (cart) => {
    const ids = Object.keys(cart);
    if (ids.length === 0) {
      setCartProductsData([]);
      return;
    }
    try {
      const response = await axios.post(`${backend}/api/product/bulk`, { ids });
      if (response.data.success) {
        setCartProductsData(response.data.products);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addToCart = async (itemId, size, mainImage) => {
    let cartData = structuredClone(cartItems);
    if(!size){
      toast.error("Select At least One size");
      return;
    }
    const sizeKey = size || "ONE_SIZE";

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
          { itemId, size: sizeKey },
          { headers: { token } },
        );
        toast.success(
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={mainImage}
              alt="Item_Image"
              style={{ width: "60px", height: "60px", borderRadius: "100%" }}
            />
            <div>
              <p>Added to cart successfull</p>
            </div>
          </div>,
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
      let itemInfo = cartProductsData.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            TotalAmount += itemInfo.price * cartItems[items][item];
          }
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

  const fetchLatestCollection = async()=>{
    try {
      const response = await axios.get(`${backend}/api/product/latest`);
      if (response.data.success) {
        setLatestCollection(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const fetchbestSeller = async () => {
    try {
      const response = await axios.get(`${backend}/api/product/bestseller`);
      if (response.data.success) {
        setBestSeller(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }finally{
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
    fetchLatestCollection();
    fetchbestSeller();
    //If token available in the local storage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, []);

  useEffect(() => {
    fetchCartProductsDetails(cartItems);
  }, [cartItems]);

  const value = {
    bestSeller,
    LatestCollection,
    loading,
    cartProductsData,
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
