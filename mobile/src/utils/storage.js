import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: '@artnart_auth_token',
  USER: '@artnart_user_profile',
  CART: '@artnart_cart_items',
  WISHLIST: '@artnart_wishlist',
  THEME: '@artnart_dark_mode',
  ORDERS: '@artnart_cached_orders',
  SAVED_ADDRESS: '@artnart_saved_shipping_address',
};

// In-memory fallback cache so the app functions seamlessly in all environments
const memoryCache = new Map();
let isNativeChecked = false;
let isNativeSupported = true;

const checkNativeSupport = async () => {
  if (isNativeChecked) return isNativeSupported;
  try {
    if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') {
      isNativeSupported = false;
      isNativeChecked = true;
      return false;
    }
    // Test native module availability
    await AsyncStorage.getItem('@__health__');
    isNativeSupported = true;
  } catch (e) {
    // If native module is null (e.g. running in Expo Go before client sync or web)
    isNativeSupported = false;
  }
  isNativeChecked = true;
  return isNativeSupported;
};

// Safe JSON helpers with silent memory fallback
const safeGet = async (key, fallback = null) => {
  try {
    const hasNative = await checkNativeSupport();
    if (hasNative) {
      const val = await AsyncStorage.getItem(key);
      if (val !== null && val !== undefined) {
        return JSON.parse(val);
      }
    }
  } catch (e) {
    // Silently fall back to in-memory store
  }
  return memoryCache.has(key) ? memoryCache.get(key) : fallback;
};

const safeSet = async (key, value) => {
  memoryCache.set(key, value);
  try {
    const hasNative = await checkNativeSupport();
    if (hasNative) {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    // Silently cached in memory
  }
};

const safeRemove = async (key) => {
  memoryCache.delete(key);
  try {
    const hasNative = await checkNativeSupport();
    if (hasNative) {
      await AsyncStorage.removeItem(key);
    }
  } catch (e) {
    // Silently removed from memory
  }
};

export const storage = {
  // Auth Token
  saveToken: (token) => safeSet(KEYS.TOKEN, token),
  getToken: () => safeGet(KEYS.TOKEN, null),
  removeToken: () => safeRemove(KEYS.TOKEN),

  // User Profile
  saveUser: (user) => safeSet(KEYS.USER, user),
  getUser: () => safeGet(KEYS.USER, null),
  removeUser: () => safeRemove(KEYS.USER),

  // Cart
  saveCart: (items) => safeSet(KEYS.CART, items),
  getCart: () => safeGet(KEYS.CART, []),

  // Wishlist
  saveWishlist: (wishlist) => safeSet(KEYS.WISHLIST, wishlist),
  getWishlist: () => safeGet(KEYS.WISHLIST, []),

  // Theme (true = dark, false = light)
  saveTheme: (isDark) => safeSet(KEYS.THEME, isDark),
  getTheme: () => safeGet(KEYS.THEME, true),

  // Orders
  saveOrders: (orders) => safeSet(KEYS.ORDERS, orders),
  getOrders: () => safeGet(KEYS.ORDERS, []),

  // Shipping Address
  saveShippingAddress: (address) => safeSet(KEYS.SAVED_ADDRESS, address),
  getShippingAddress: () => safeGet(KEYS.SAVED_ADDRESS, null),

  // Full Sign Out
  clearAuth: async () => {
    await safeRemove(KEYS.TOKEN);
    await safeRemove(KEYS.USER);
  },
};

export default storage;
