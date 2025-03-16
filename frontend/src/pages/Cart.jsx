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
    backendUrl,
    token,
  } = useContext(ShopContext) || {};

//   const checkoutHandeler=async(amount)=>{
//     console.log(amount);
//     const {data:keyData}=await axios.get("api/payment/getkey");
//     const {key}= keyData
//     console.log(key);
//     const {data:orderData}= await axios.post("/api/payment/process",{amount})
// console.log(orderData);
//     const{order}=orderData;
//     console.log(order);





  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (Array.isArray(cartItems?.items) && products.length > 0) {
      const tempData = cartItems.items.map((element) => ({
        _id: element.itemId,
        pt:element._id,
        size: element.size,
        quantity: element.quantity || 1, // Ensure at least 1
      }));
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const getUserDetails = async () => {
    if (!token || token.trim() === "") return;

    try {
      const res = await axios.get(`${backendUrl}/api/user/getUserDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
//console.log(res);
      setUser(res.data || null);
    } catch (error) {
      //console.error("Error fetching user details:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    if (token?.trim()) {
      getUserDetails();
    }
  }, [token]);

  // Extract initials from user name
  const getInitials = (name) => {
    if (!name) return "U"; // Default if name is missing
    const words = name.trim().split(/\s+/);
    return words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();
  };

  // Handle item removal
  const handleRemoveItem = (itemId, size) => {
    updateQuantity(itemId, size, 0);
    toast.info("Item removed from cart");
  };

  if (!products.length) {
    return <p className="text-gray-500 text-center py-10">Loading cart...</p>;
  }
//console.log("printing the cart data",cartData);
  return (
    <div className="border-t pt-14 px-4 sm:px-10 lg:px-20">
      {/* User Info Card */}
      <div className="p-5 bg-white flex items-center justify-between rounded-lg shadow-md border mb-6">
        <div className="flex items-center gap-4">
          {/* Circular Avatar with Initials */}
          <div className="w-12 h-12 bg-[#262B2B] text-white flex items-center justify-center text-lg font-bold rounded-full">
            {getInitials(user?.name)}
          </div>
          {/* User Details */}
          <div>
            <p className="text-lg font-semibold text-[#262B2B]">{user?.name || "Guest"}</p>
            <p className="text-sm text-gray-500">{user?.email || "No Email"}</p>
          </div>
        </div>
      </div>

      {/* Cart Title */}
      <div className="text-2xl mb-3 text-[#262B2B]">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-lg p-5">
        {cartData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
        ) : (
          cartData.map((item) => {
            const product = products.find((p) => p._id === item._id);
            if (!product) return null;

            return (
              <div
                className="py-4 border-b flex flex-col sm:flex-row items-center gap-6"
                key={`${item._id}-${item.size}`}
              >
                {/* Product Image */}
                <img
                  src={product.images?.[0] || assets.default_product}
                  className="w-20 h-20 object-cover rounded-lg"
                  alt={product.name || "Product"}
                />

                {/* Product Details */}
                <div className="flex-1">
                  <p className="text-lg font-semibold text-[#262B2B]">{product.name}</p>
                  <p className="text-gray-600">
                    {currency}
                    {product.price}
                  </p>
                  <p className="px-2 py-1 text-sm border bg-gray-100 inline-block rounded mt-2">
                    Size: {item.size}
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-4">
                
                  <input
                    className="border w-12 text-center py-1 rounded"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = Math.max(Number(e.target.value), 1);
                      updateQuantity(item._id, item.size, newQty);
                    }}
                  />
                
                </div>

                {/* Remove Item */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item.pt, item.size,)}
                >
                  ❌
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Section */}
      {cartData.length > 0 && (
        <div className="flex justify-end mt-12">
          <div className="w-full sm:w-[450px] bg-white shadow-lg rounded-lg p-5">
            <CartTotal />
            <button
              className="bg-[#262B2B] text-white w-full py-3 rounded-md text-lg font-semibold mt-6 hover:bg-black transition-all"
             // onClick={() =>checkoutHandeler(200)}
              onClick={() => navigate("/place-order")}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
