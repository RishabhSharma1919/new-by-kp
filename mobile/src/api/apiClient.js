// API Client configuration
// In React Native / Expo, localhost refers to the phone itself.
// Use EXPO_PUBLIC_API_URL or production serverless backend
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://new-by-kp-cykh.vercel.app";

export const ENDPOINTS = {
  // Auth
  SEND_OTP: "/api/user/verifyemail",
  REGISTER: "/api/user/registerUser",
  LOGIN: "/api/user/login",
  FORGOT_PASSWORD: "/api/user/forgotpassword",
  RESET_PASSWORD: "/api/user/resetpassword",
  GET_USER_DETAILS: "/api/user/getUserDetails",

  // Products
  LIST_PRODUCTS: "/api/product/list",
  SINGLE_PRODUCT: (id) => `/api/product/single/${id}`,

  // Cart
  GET_CART: "/api/cart/get",
  ADD_TO_CART: "/api/cart/add",
  UPDATE_CART: "/api/cart/update",
  CLEAR_CART: "/api/cart/clear",

  // Wishlist
  GET_WISHLIST: "/api/wishlist/get",
  ADD_WISHLIST: "/api/wishlist/add",
  REMOVE_WISHLIST: "/api/wishlist/remove",

  // Orders
  PLACE_ORDER_COD: "/api/order/place",
  PLACE_ORDER_STRIPE: "/api/order/stripe",
  GET_USER_ORDERS: "/api/order/userorders",

  // Blogs
  LIST_BLOGS: "/api/blog/listBlog",
  SINGLE_BLOG: (id) => `/api/blog/single/${id}`,
  LIKE_BLOG: "/api/blog/like",

  // Upload
  UPLOAD_IMAGE: "/api/upload/upload",
};

/**
 * Resilient API fetcher with automatic fallback across configured hostnames and timeouts.
 */
export async function apiFetch(endpoint, { method = 'GET', body, headers = {}, token = null, timeout = 7000 } = {}) {
  // Prioritize configured env URL first, followed by Android emulator alias and localhost
  const candidateUrls = [
    process.env.EXPO_PUBLIC_API_URL,
    "https://new-by-kp-cykh.vercel.app",
    "http://10.0.2.2:4000",
    "http://localhost:4000",
  ].filter(Boolean);

  // Deduplicate
  const uniqueUrls = Array.from(new Set(candidateUrls));
  let lastError = null;

  for (const baseUrl of uniqueUrls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      };

      if (token) {
        reqHeaders['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: reqHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      lastError = err;
    }
  }

  return { ok: false, error: lastError?.message || 'Network request failed', data: null };
}
