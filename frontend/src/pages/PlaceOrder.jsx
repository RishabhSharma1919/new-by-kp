import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    products,
    delivery_fee,
    cartItems = { items: [] }, // Ensure cartItems is always an object
    getCartAmount,
    backendUrl,
    setCartItems,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zipcode: "",
    phone: "",
    state: "",
    street: "",
    country: "",
    city: "",
    // descriptionbyuser: "hi",
    // imageuser: null,
  });

  const onChangeHandler = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }
  
    const orderItems = [];
  
    if (Array.isArray(cartItems.items)) {
      for (const item of cartItems.items) {
        if (item.quantity > 0) {
          const itemInfo = products.find((product) => product._id === item.itemId);
          
          if (!itemInfo) {
            console.error(`Product with ID ${item.itemId} not found in products list.`);
            continue;  // Skip this item if it doesn't exist in products
          }
  
          orderItems.push({
            ...itemInfo,  // Clone object directly
            size: item.size,
            imageuser:item.image,
            quantity: item.quantity,
          });
        }
      }
    } else {
      console.error("cartItems.items is not an array", cartItems.items);
    }
  
    if (orderItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
  
    const orderData = {
      address: formData,
      itemi:orderItems,
      items: cartItems.items,  // Pass directly
      amount: getCartAmount() + delivery_fee,
    };
  console.log("from yje place order",orderData);
  
    try {
      let orderSuccess = false;
  
      switch (method) {
        case "cod": {
          const res = await axios.post(
            `http://localhost:4000/api/order/place`,
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          if (res.data.success) {
            orderSuccess = true;
          } else {
            toast.error(res.data.message);
          }
          break;
        }
  
        case "stripe": {
          const responseStripe = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if (responseStripe.data.success) {
            window.location.replace(responseStripe.data.session_url);
            return;
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }
  
        default:
          toast.error("Invalid payment method selected.");
          return;
      }
  
      if (orderSuccess) {
        try {
          // 🗑 Request backend to delete cart (Make sure URL matches backend route)
          await axios.delete(`http://localhost:4000/api/cart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        
          // Clear local state
          setCartItems({ items: [] });
        
          toast.success("Order placed successfully!");
        
          setTimeout(() => {
            navigate("/orders");
          }, 100);
        } catch (err) {
          console.error("Failed to clear cart from database:", err);
        }
        
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
    }
  };
  

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
        />

        <input
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          required
        />

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            required
          />
          <input
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            required
          />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            required
          />
          <input
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            required
          />
        </div>

        <input
          type="text"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          required
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="mt-8">
        <CartTotal />
        <Title text1="PAYMENT" text2="METHOD" />

        <div className="flex gap-3 flex-col lg:flex-row">
          {["stripe", "cod"].map((paymentMethod) => (
            <div key={paymentMethod} onClick={() => setMethod(paymentMethod)} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === paymentMethod ? "bg-green-400" : ""}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">{paymentMethod.toUpperCase()}</p>
            </div>
          ))}
        </div>

        <button className="bg-black text-white px-16 py-3 text-sm mt-8" type="submit">PLACE ORDER</button>
      </div>
    </form>
  );
};

export default PlaceOrder;
