import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "https://new-by-kp.vercel.app";
  const backendUrl = rawBackendUrl.replace(/\/+$/, "");
  //console.log("this the backend url",backendUrl);
  //console.log(import.meta.env);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState({});//
  const [wishitems, setWishitems] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [price, setprice] = useState("");
  const [cartAmount, setCartAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [buyproduct,setbuyproduct] = useState({});
  const navigate = useNavigate();

 
 
  // Update token when localStorage changes
  
  
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart(); // Fetch cart items
      getwishlist(); // Fetch wishlist items

    }
  }, [token]);
  

  const addToWishlist = async (product) => {
    //console.log("called inside shopcontext wishlist");
  
    if (!token) {
      toast.error("Please log in to add items to the wishlist.");
      return;
    }
  
    if (!product || !product._id) {
      //console.error("Invalid product data:", product);
      toast.error("Invalid product. Please try again.");
      return;
    }
  
    //console.log("Adding to wishlist:", product);
  
    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/add`,
        {
          itemId: product._id,
          wish: true, // Mark as wished
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      //console.log("Added to wishlist:", response.data);
      toast.success("Item added to wishlist!");
  
      await getwishlist(); // Fetch the updated wishlist
    } catch (error) {
      //console.error("Failed to add to wishlist:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
    }
  };
  
  const getwishlist = async () => {
    if (!token) return;
  
    try {
      const res = await axios.get(`${backendUrl}/api/wishlist/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      //console.log("API Response for Wishlist:", res.data);
  
      if (res.data.success && res.data.wishlist?.items) {
        //console.log("Wishlist Items:", res.data.wishlist.items);
        setWishitems(res.data.wishlist.items); // ✅ Set `items` array, not the whole object
      // Update wishitems state
setWishitems(res.data.wishlist.items);

// Log updated state after it actually changes

        
      } else {
        //console.warn("Wishlist response missing 'items' field.");
        setWishitems([]); // Reset to empty array if missing
      }
    } catch (error) {
      //console.error("Error fetching user wishlist:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
      setWishitems([]);
    }
  };
  
  useEffect(() => {
    //console.log("Updated Wishlist State:", wishitems);
  }, [wishitems]);
  
  
  const removeFromWishlist = async (itemId) => {
    if (!token) {
      toast.error("Please log in to remove items from the wishlist.");
      return;
    }
    //console.log("token is here",token);
  
    try {
      const response = await axios.post(`${backendUrl}/api/wishlist/remove`, {
        itemId  },// Send itemId in the request body
       { headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to remove item.");
      }
  
      toast.success("Item removed from wishlist!");
      await getwishlist(); // Refresh the wishlist
    } catch (error) {
      //console.error("Error removing from wishlist:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };
  

  // Fetch User Details
  const getUserDetails = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${backendUrl}/api/user/getUserDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      //console.error("Error fetching user details:", error);
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




  // console.log("Cart Items:", cartItems);

  // const buynow = async (buyproduct) => {
  //   if (!token) {
  //     toast.error("Please log in to add items to the cart.");
  //     return;
  //   }
  // //console.log("i am seeing",cartItem);
  //   try {
  //     const response = await fetch(`${backendUrl}/api/cart/add`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(buyproduct),
  //     });
  
  //     if (!response.ok) {
  //       //console.error("Failed to add item:", await response.text());
  //       toast.error("Failed to add item to cart.");
  //       return;
  //     }
  
  //     const data = await response.json();
  //     //console.log("Added to cart:", data);
  //     toast.success("Item added to cart!");
  
  //   } catch (error) {
  //     //console.error("Failed to add to cart:", error);
  //     toast.error("Something went wrong. Try again.");
  //   }
  // };







  const addToCart = async (cartItem) => {
    if (!token) {
      toast.error("Please log in to add items to the cart.");
      return;
    }
  //console.log("i am seeing",cartItem);
    try {
      const response = await fetch(`${backendUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });
  
      if (!response.ok) {
        //console.error("Failed to add item:", await response.text());
        toast.error("Failed to add item to cart.");
        return;
      }
  
      const data = await response.json();
      //console.log("Added to cart:", data);
      toast.success("Item added to cart!");
  
      await getUserCart(); // Fetch updated cart data
    } catch (error) {
      //console.error("Failed to add to cart:", error);
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
  if (!token) return;

  try {
    const res = await axios.post(
      `${backendUrl}/api/cart/update`,
      { itemId, size, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setCartItems(res.data.cart); // Update cart in state instantly
      toast.success("Cart updated successfully!");
    }
  } catch (error) {
    //console.error("Error updating quantity:", error);
    toast.error("Failed to update cart");
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
      
      const response = await axios.get(`${backendUrl}/api/product/list`);
      //console.log("what is inside getproduct data",response);
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      //console.error("Error fetching products:", error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      //console.log("API Cart Response:", res.data); // Debugging
  
      if (res.data.success && res.data.cart) {
        //console.log("sp get user cart",res.data.cart);
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
  
  

  useEffect(() => {    
    getProductsData();
    if (token) getUserCart();
  }, [token]); // Depend on token changes
  
  

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    wishitems,
    buyproduct,
    setbuyproduct,
    cartItems,
    addToWishlist,
    wishlist,
    getwishlist,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    removeFromWishlist,
    navigate,
    backendUrl,
    cartAmount,
    
    token,
    setToken,
    setCartItems,
    price,
    setprice,
    user, // Add user data
    setUser,
    getUserDetails, // Function to refresh user details
  };
  

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;



















