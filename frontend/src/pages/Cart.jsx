import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    user,
    setUser,
    token,
  } = useContext(ShopContext) || {};

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (Array.isArray(cartItems?.items) && products.length > 0) {
      const tempData = cartItems.items.map((element) => ({
        _id: element.itemId,
        size: element.size,
        quantity: element.quantity || 1, // Ensure quantity is at least 1
      }));
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const getUserDetails = async () => {
    if (!token || token.trim() === "") return;

    try {
      const res = await axios.get("http://localhost:4000/api/user/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    if (token && token.trim() !== "") {
      getUserDetails();
    }
  }, [token]);

  // Extract initials from user name
  const getInitials = (name) => {
    if (!name) return "U"; // Default to 'U' if name is missing
    const words = name.split(" ");
    return words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();
  };

  if (!products.length) {
    return <p className="text-gray-500 text-center py-10">Loading cart...</p>;
  }

  return (
    <div className="border-t pt-14">
      {/* User Info Card */}
      <div className="p-5 bg-gray-100 flex items-center justify-between rounded-lg shadow-md border mb-6">
        <div className="flex items-center gap-4">
          {/* Circular Avatar with Initials */}
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-lg font-bold rounded-full">
            {getInitials(user?.name)}
          </div>
          {/* User Details */}
          <div>
            <p className="text-lg font-semibold">{user?.name || "Guest"}</p>
            <p className="text-sm text-gray-500">{user?.email || "No Email"}</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div>
        {cartData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
        ) : (
          cartData.map((item) => {
            const productsData = products.find(
              (product) => product._id === item._id
            );

            if (!productsData) return null;

            return (
              <div
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                key={`${item._id}-${item.size}`}
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productsData.images?.[0] || assets.default_product}
                    className="w-16 sm:w-20"
                    alt={productsData.name || "Product"}
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {productsData.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {productsData.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <input
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center"
                  type="number"
                  min={1}
                  value={item.quantity} // Bind value directly
                  onChange={(e) => {
                    const newQty = Math.max(Number(e.target.value), 1); // Prevent negative values
                    updateQuantity(item._id, item.size, newQty);
                  }}
                />
                
                {/* Remove Item */}
                <img
                  src={assets.bin_icon}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  alt="Remove"
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Section */}
      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                className="bg-black text-white text-sm my-8 px-8 py-3"
                onClick={() => navigate("/place-order")}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
