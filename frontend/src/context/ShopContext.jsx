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
  const [cartAmount, setCartAmount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Update token when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch User Details
  const getUserDetails = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:4000/api/user/getUserDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details.");
      setUser(null);
    }
  };

  // Fetch user details when token is available
  useEffect(() => {
    if (token) getUserDetails();
  }, [token]);

  // Recalculate cart amount whenever cartItems or products change
  useEffect(() => {
    setCartAmount(getCartAmount());
  }, [cartItems, products]);

  console.log("Cart Items:", cartItems);
  
  const addToCart = async (cartItem) => {
    if (!token) {
      toast.error("Please log in to add items to the cart.");
      return;
    }
  console.log(cartItem);
    try {
      const response = await fetch(`http://localhost:4000/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });
  
      if (!response.ok) {
        console.error("Failed to add item:", await response.text());
        toast.error("Failed to add item to cart.");
        return;
      }
  
      const data = await response.json();
      console.log("Added to cart:", data);
      toast.success("Item added to cart!");
  
      await getUserCart(); // Fetch updated cart data
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Something went wrong. Try again.");
    }
  };
  
  
  const getCartCount = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0;
  
    if (cartItems.items) {
      // If cart structure is { items: [...] }
      return cartItems.items.reduce((total, item) => total + item.quantity, 0);
    } else {
      // If cart structure is { productId: { size: quantity } }
      return Object.values(cartItems).reduce((acc, sizes) => {
        return acc + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
      }, 0);
    }
  };
  

  const updateQuantity = async (itemId, size, quantity) => {
    let updatedCart = { ...cartItems };
    let itemIndex = updatedCart.items.findIndex(item => item._id === itemId);
  
    if (itemIndex !== -1) {
      updatedCart.items[itemIndex].quantity = quantity;
    }
  
    setCartItems(updatedCart);
  
    if (token) {
      try {
        await axios.post(
          `http://localhost:4000/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) {
        console.error("Error updating quantity:", e);
        toast.error(e.message);
      }
    }
  };
  
  const getCartAmount = () => {
    return cartItems?.amount || 0;
  };
  
  useEffect(() => {
    setCartAmount(getCartAmount()); 
  }, [cartItems, products]); 
    
  //console.log("cart amount",getCartCount());

  const getProductsData = async () => {
    try {      
      
      const response = await axios.get(`http://localhost:4000/api/product/list`);
      console.log("what is inside getproduct data",response);
      
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
      const res = await axios.get(`http://localhost:4000/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Cart Response:", res.data); // Debugging
  
      if (res.data.success && res.data.cart) {
        setCartItems(res.data.cart); // Ensure structure matches expected state
      } else {
        setCartItems({}); // Reset on failure
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
      toast.error(error.message);
      setCartItems({});
    }
  };
  // useEffect(() => {
  //   console.log("Updated Cart Items:", cartItems);
  // }, [cartItems]);
   
  

  useEffect(() => {    
    getProductsData();
    if (token) getUserCart();
  }, [token]); // Depend on token changes
  
  // useEffect(() => {
  //   console.log("Updated Cart Count:", getCartCount()); // Debugging log
  // }, [cartItems]); // Trigger update when `cartItems` changes
  // useEffect(() => {
  //   console.log("Updated Cart Items:", cartItems);
  // }, [cartItems]);
  

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
    user, // Add user data
    getUserDetails, // Function to refresh user details
  };
  

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
