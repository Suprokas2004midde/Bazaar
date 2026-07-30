import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const CurrencySym = "₹";
  const DeliveryFees = 100;
  const backend = import.meta.env.VITE_BACKEND_SERVER;

  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [cartProductsData, setCartProductsData] = useState([]); // for bulk upload
  const [bestSeller, setBestSeller] = useState([]);
  const [LatestCollection, setLatestCollection] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  const getUserProfile = async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const response = await axios.get(`${backend}/api/user/profile`, {
        headers: { token: activeToken },
      });
      if (response.data.success) {
        setUserData(response.data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const updateUserProfile = async (updateFields) => {
    if (!token) {
      toast.error("Please login to update profile");
      return false;
    }
    try {
      const response = await axios.put(
        `${backend}/api/user/profile`,
        updateFields,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Profile updated!");
        setUserData(response.data.profile);
        return true;
      } else {
        toast.error(response.data.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

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
    }
  };

  // ─── Wishlist ───────────────────────────────────────────────
  const getUserWishlist = async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const response = await axios.post(
        `${backend}/api/wishlist/get`,
        {},
        { headers: { token: activeToken } },
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (error) {
      console.log("Failed to fetch wishlist:", error.message);
    }
  };

  const toggleWishlist = async (productId, productImage) => {
    if (!token) {
      toast.error("Please login to save to wishlist");
      return;
    }
    // Optimistic update
    const alreadyIn = wishlist.includes(String(productId));
    setWishlist((prev) =>
      alreadyIn ? prev.filter((id) => id !== String(productId)) : [...prev, String(productId)]
    );
    try {
      const response = await axios.post(
        `${backend}/api/wishlist/toggle`,
        { productId },
        { headers: { token } },
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
        if (response.data.added) {
          toast.success(
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={productImage}
                alt="Item_Image"
                style={{ width: "60px", height: "60px", borderRadius: "100%" }}
              />
              <div>
                <p>Added to Wishlist</p>
              </div>
            </div>,
          );
        } else {
          toast.info("Removed from wishlist");
        }
      } else {
        // Rollback optimistic update
        setWishlist((prev) =>
          alreadyIn ? [...prev, String(productId)] : prev.filter((id) => id !== String(productId))
        );
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      // Rollback optimistic update
      setWishlist((prev) =>
        alreadyIn ? [...prev, String(productId)] : prev.filter((id) => id !== String(productId))
      );
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const isInWishlist = (productId) => wishlist.includes(String(productId));

  const clearWishlist = async () => {
    if (!token) return;
    try {
      await axios.post(`${backend}/api/wishlist/clear`, {}, { headers: { token } });
      setWishlist([]);
    } catch (error) {
      console.log(error.message);
    }
  };
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchLatestCollection();
    fetchbestSeller();
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
      getUserProfile(savedToken);
      getUserWishlist(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserProfile(token);
    }
  }, [token]);

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
    userData,
    setUserData,
    getUserProfile,
    updateUserProfile,
    // Wishlist
    wishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getUserWishlist,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
