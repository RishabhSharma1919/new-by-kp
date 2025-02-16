import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [price, setprice] = useState("");
  const navigate = useNavigate();

  const addToCart = async (itemId, size, price) => {
    
    if (!size) {
      toast.error("Select product size!");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `http://localhost:4000/api/cart/add`,
          { itemId, size, price },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (e) {
        console.error("Error adding to cart:", e);
        toast.error(e.message);
      }
    }
  };

  const getCartCount = () => {    
    return cartItems ? Object.values(cartItems)?.reduce((acc, sizes) => {
      return acc + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
    }, 0) : 0
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `http://localhost:4000/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` }}
        );
      } catch (e) {
        console.error("Error updating quantity:", e);
        toast.error(e.message);
      }
    }
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) return total;
      return total + Object.entries(sizes).reduce((sum, [_, qty]) => sum + qty * itemInfo.price, 0);
    }, 0);
  };

  const getProductsData = async () => {
    try {      
      
      const response = await axios.get(`http://localhost:4000/api/product/list`);
      console.log(response);
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/cart/get`, { headers: { Authorization: `Bearer ${token}` }});
      
      if (res.data.success) {
        setCartItems(res.data.cart);
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {    
    getProductsData();
    getCartCount()
    if (token) getUserCart();
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setCartItems,
    price,
    setprice,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
