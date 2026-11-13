import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiFetch, ENDPOINTS, BASE_URL } from '../api/apiClient';
import { DARK_THEME, LIGHT_THEME } from '../constants/theme';
import storage from '../utils/storage';

export const ShopContext = createContext();

const SAMPLE_PRODUCTS = [
  {
    _id: "demo1",
    name: "Golden Serenity Canvas",
    description: "An evocative modern oil painting capturing radiant golden textures and tranquil warmth. Hand-stretched archival canvas with museum-grade varnish.",
    price: 340,
    images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800"],
    category: "Paintings",
    subCategory: "Oil",
    bestSeller: true,
    art1: true,
    length: 36,
    breadth: 24,
    size: "36x24 in",
  },
  {
    _id: "demo2",
    name: "Ethereal Marble Muse",
    description: "Handcrafted contemporary sculpture exploring neoclassical silhouettes with abstract curvature. Carved from Carrara stone.",
    price: 520,
    images: ["https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800"],
    category: "Sculpture",
    subCategory: "Marble",
    bestSeller: true,
    art2: true,
    length: 20,
    breadth: 12,
    size: "20x12 in",
  },
  {
    _id: "demo3",
    name: "Urban Solitude #4",
    description: "Archival monochrome photographic print exploring modern architecture in dramatic shadows. Printed on Hahnemühle Photo Rag 308gsm.",
    price: 190,
    images: ["https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800"],
    category: "Photography",
    subCategory: "Monochrome",
    bestSeller: false,
    art3: true,
    length: 18,
    breadth: 24,
    size: "18x24 in",
  },
  {
    _id: "demo4",
    name: "Minimalist Geometry III",
    description: "Limited edition graphic design print on 300gsm cotton rag archival paper. Hand-signed and numbered by the artist.",
    price: 160,
    images: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800"],
    category: "Design",
    subCategory: "Abstract",
    bestSeller: true,
    art4: true,
    length: 30,
    breadth: 30,
    size: "30x30 in",
  },
  {
    _id: "demo5",
    name: "Whispers of the Forest",
    description: "Intricate botanical digital illustration inspired by ancient folklore and nature spirits. Rich pigment inks with UV protection.",
    price: 210,
    images: ["https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800"],
    category: "Illustration",
    subCategory: "Botanical",
    bestSeller: false,
    art5: true,
    length: 24,
    breadth: 18,
    size: "24x18 in",
  },
];

const SAMPLE_BLOGS = [
  {
    _id: 'b1',
    title: 'The Resonance of Light: Modern Oil Techniques',
    description:
      'Explore how contemporary painters use natural mineral pigments and multi-layered glazing to evoke dramatic atmospheric depth and architectural tranquility in modern spaces.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
    date: 'Oct 14, 2026',
    author: 'Elena Vance, Chief Curator',
    likes: 42,
  },
  {
    _id: 'b2',
    title: 'Sculptural Harmony in Minimalist Architecture',
    description:
      'Why raw Carrara marble, patinated bronze, and hand-carved limestone are experiencing a profound renaissance in luxury interior art collections this season.',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
    date: 'Oct 02, 2026',
    author: 'Marcus Thorne',
    likes: 67,
  },
  {
    _id: 'b3',
    title: 'Collecting Archival Photography as an Asset',
    description:
      'A practical collector’s guide to verifying editions, acid-free mounts, UV-protective glass, and preserving silver gelatin prints across generations.',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
    date: 'Sep 26, 2026',
    author: 'Sophia Chen',
    likes: 31,
  },
];

export const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  // Theme Management (Dark Gallery default, persisted)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      storage.saveTheme(next);
      return next;
    });
  };

  // State Management
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [blogs, setBlogs] = useState(SAMPLE_BLOGS);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState(["demo1", "demo4"]);
  
  // Real Authentication State (null = Guest mode!)
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [orders, setOrders] = useState([]);

  // Load Persisted Storage on Launch
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Theme
        const storedTheme = await storage.getTheme();
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme);
        }

        // 2. Cart & Wishlist
        const storedCart = await storage.getCart();
        if (Array.isArray(storedCart) && storedCart.length > 0) {
          setCartItems(storedCart);
        }

        const storedWishlist = await storage.getWishlist();
        if (Array.isArray(storedWishlist)) {
          setWishlist(storedWishlist);
        }

        // 3. Orders
        const storedOrders = await storage.getOrders();
        if (Array.isArray(storedOrders) && storedOrders.length > 0) {
          setOrders(storedOrders);
        }

        // 4. Auth Session
        const savedToken = await storage.getToken();
        const savedUser = await storage.getUser();

        if (savedToken) {
          setToken(savedToken);
          if (savedUser) setUser(savedUser);

          // Verify token validity with backend
          const res = await apiFetch(ENDPOINTS.GET_USER_DETAILS, {
            method: 'GET',
            token: savedToken,
          });

          if (res.ok && res.data) {
            const freshUser = res.data.user || res.data;
            if (freshUser && freshUser.email) {
              setUser(freshUser);
              storage.saveUser(freshUser);
            }
            // Fetch live user orders
            fetchUserOrders(savedToken);
          } else if (res.status === 401) {
            // Token expired or invalid -> revert to guest gracefully
            console.log('[Auth] Token expired, resetting to guest');
            await storage.clearAuth();
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('[ShopContext] Initialization warning:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  // Fetch Live Products from backend
  const fetchProducts = useCallback(async () => {
    try {
      const res = await apiFetch(ENDPOINTS.LIST_PRODUCTS);
      if (res.ok && res.data?.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
        setProducts(res.data.products);
      }
    } catch (e) {
      // Keep sample products as resilient fallback
    }
  }, []);

  // Fetch Live Blogs from backend
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await apiFetch(ENDPOINTS.LIST_BLOGS);
      if (res.ok && res.data?.blogs && Array.isArray(res.data.blogs) && res.data.blogs.length > 0) {
        const mapped = res.data.blogs.map((b) => ({
          _id: b._id,
          title: b.title,
          description: b.description,
          image: b.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
          date: new Date(b.createdAt || Date.now()).toLocaleDateString(),
          author: b.author || 'Curator',
          likes: b.likes || 12,
        }));
        setBlogs(mapped);
      }
    } catch (e) {
      // Keep sample blogs fallback
    }
  }, []);

  // Fetch User Orders from backend
  const fetchUserOrders = useCallback(async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;

    try {
      const res = await apiFetch(ENDPOINTS.GET_USER_ORDERS, {
        method: 'GET',
        token: activeToken,
      });

      if (res.ok && res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
        storage.saveOrders(res.data.orders);
      }
    } catch (e) {
      console.warn('[Orders] Fetch orders warning:', e);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
    fetchBlogs();
  }, [fetchProducts, fetchBlogs]);

  // --- Authentication Methods ---

  const sendOtp = async (email) => {
    try {
      const res = await apiFetch(ENDPOINTS.SEND_OTP, {
        method: "POST",
        body: { email },
      });

      if (res.ok && res.data?.success) {
        return { success: true, message: res.data.message || `Verification code sent to ${email}` };
      }
      return { success: false, message: res.data?.message || "Failed to send verification code. Please check your email." };
    } catch (e) {
      return { success: false, message: "Network connection error. Please try again." };
    }
  };

  const registerUser = async (name, email, password, verifyCode) => {
    try {
      const res = await apiFetch(ENDPOINTS.REGISTER, {
        method: "POST",
        body: { name, email, password, verifyCode },
      });

      if (res.ok && res.data?.success) {
        // Auto-sign in the user upon successful registration
        const loginRes = await loginUser(email, password);
        return {
          success: true,
          message: res.data.message || "Account registered successfully!",
          autoLoggedIn: loginRes.success,
        };
      }
      return { success: false, message: res.data?.message || "Registration failed. Invalid code or details." };
    } catch (e) {
      return { success: false, message: "Network error during registration." };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await apiFetch(ENDPOINTS.LOGIN, {
        method: "POST",
        body: { email, password },
      });

      if (res.ok && res.data?.success && res.data.token) {
        const receivedToken = res.data.token;
        const userObj = res.data.user || { name: email.split('@')[0], email };

        setToken(receivedToken);
        setUser(userObj);

        await storage.saveToken(receivedToken);
        await storage.saveUser(userObj);

        // Synchronize user orders
        fetchUserOrders(receivedToken);

        return { success: true, token: receivedToken, user: userObj };
      }
      return { success: false, message: res.data?.message || "Invalid credentials." };
    } catch (e) {
      return { success: false, message: "Unable to reach authentication server." };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await apiFetch(ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        body: { email },
      });

      if (res.ok && res.data?.success) {
        return { success: true, message: res.data.message || `Reset code sent to ${email}` };
      }
      return { success: false, message: res.data?.message || "Failed to initiate password reset." };
    } catch (e) {
      return { success: false, message: "Network error during password reset request." };
    }
  };

  const resetPassword = async (email, resetCode, newPassword) => {
    try {
      const res = await apiFetch(ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        body: { email, resetCode, newPassword },
      });

      if (res.ok && res.data?.success) {
        return { success: true, message: res.data.message || "Password updated successfully." };
      }
      return { success: false, message: res.data?.message || "Invalid or expired reset code." };
    } catch (e) {
      return { success: false, message: "Network error during password reset." };
    }
  };

  const logoutUser = async () => {
    await storage.clearAuth();
    setToken(null);
    setUser(null);
  };

  const likeBlog = async (blogId) => {
    setBlogs((prev) =>
      prev.map((b) => (b._id === blogId ? { ...b, likes: b.likes + 1 } : b))
    );
  };

  // --- Cart Operations (Persistent) ---

  const addToCart = (product, size = "Standard", customDescription = "", customImage = null) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id && item.size === size);
      let nextCart;
      if (existing) {
        nextCart = prev.map((item) =>
          item.product._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        nextCart = [
          ...prev,
          {
            id: `${product._id}-${size}-${Date.now()}`,
            product,
            size,
            quantity: 1,
            customDescription,
            customImage,
          },
        ];
      }
      storage.saveCart(nextCart);
      return nextCart;
    });
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    setCartItems((prev) => {
      let nextCart;
      if (newQty <= 0) {
        nextCart = prev.filter((item) => item.id !== cartItemId);
      } else {
        nextCart = prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      }
      storage.saveCart(nextCart);
      return nextCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    storage.saveCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const nextWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      storage.saveWishlist(nextWishlist);
      return nextWishlist;
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // --- Place Order (Real Backend Sync + Guest Support) ---

  const placeOrder = async (address, paymentMethod = "COD") => {
    const totalAmount = getCartTotal() + delivery_fee;
    const formattedItems = cartItems.map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      image: item.product.images?.[0] || "",
      customDescription: item.customDescription || "",
    }));

    // Cache shipping address for future convenience
    storage.saveShippingAddress(address);

    // If Authenticated: place directly on live backend
    if (token) {
      try {
        const res = await apiFetch(ENDPOINTS.PLACE_ORDER_COD, {
          method: "POST",
          token,
          body: {
            items: formattedItems,
            amount: totalAmount,
            address,
            paymentMethod,
          },
        });

        if (res.ok && res.data?.success) {
          const serverOrder = res.data.order || {
            _id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            date: Date.now(),
            status: "Order Placed",
            amount: totalAmount,
            paymentMethod,
            address,
            items: formattedItems,
          };

          setOrders((prev) => [serverOrder, ...prev]);
          storage.saveOrders([serverOrder, ...orders]);
          clearCart();
          fetchUserOrders(token);
          return { success: true, order: serverOrder };
        }
      } catch (err) {
        console.warn("[Orders] Backend place order failed, falling back to local:", err);
      }
    }

    // Guest Order Placement (allowed without an account)
    const guestOrder = {
      _id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: Date.now(),
      status: "Order Placed",
      amount: totalAmount,
      paymentMethod,
      address,
      items: formattedItems,
      isGuestOrder: !token,
    };

    setOrders((prev) => {
      const updated = [guestOrder, ...prev];
      storage.saveOrders(updated);
      return updated;
    });
    clearCart();
    return { success: true, order: guestOrder };
  };

  return (
    <ShopContext.Provider
      value={{
        currency,
        delivery_fee,
        isDarkMode,
        theme,
        toggleTheme,
        products,
        blogs,
        cartItems,
        wishlist,
        token,
        user,
        isGuest: !token,
        isInitializing,
        orders,
        sendOtp,
        registerUser,
        loginUser,
        forgotPassword,
        resetPassword,
        logoutUser,
        likeBlog,
        addToCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        getCartTotal,
        getCartCount,
        placeOrder,
        fetchProducts,
        fetchBlogs,
        fetchUserOrders,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
