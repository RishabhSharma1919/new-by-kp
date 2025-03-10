import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [imagei,setimagei] = useState([]);
  
  
  const loadOrderData = async () => {
    try {
      if (!token) {
        toast.error("You must be logged in to view orders.");
        return;
      }
  
      const response = await axios.get("http://localhost:4000/api/order/userorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Inside Orders.jsx:", response);
  
      if (response.data.success) {
        let allOrders = [];
  
        response.data.orders.forEach((order) => {
          if (!order.items && !order.itemi) return; // ✅ Prevent errors
  
          let combinedItems = [];
  
          // Merge items from both `items` and `itemi`
          order.items?.forEach((item) => {
            combinedItems.push({
              name: item.name || "",
              description: item.description || "hi",
              images: typeof item.image === "string" && item.image.trim() ? [item.image] : ["🛒"],
              price: item.price + "  delivery cost is not included in this!",
              quantity: item.quantity,
              size: item.size,
              status: order.status,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
            });
          });
  
          order.itemi?.forEach((itemk, index) => {
            if (combinedItems[index]) {
              // ✅ Merge with existing item if possible
              combinedItems[index].images.push(itemk.images?.[0]); // Add image from `itemi`
              combinedItems[index].name += "" + (itemk.name || "Unnamed Product");
              combinedItems[index].description ;
            } else {
              // ✅ If no matching `items`, add separately
              combinedItems.push({
                name: itemk.name || "Unnamed Product",
                description: itemk.description || "No description available",
                images: [itemk.images?.[0]], // ✅ Store images in an array
                status: order.status,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id,
              });
            }
          });
  
          allOrders.push(...combinedItems);
        });
  
        setOrderData(allOrders.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };
  
  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
  <div className="border-t pt-16">
  <div className="text-2xl">
    <Title text1="MY" text2="ORDERS" />
  </div>

  <div>
    {orderData.length === 0 ? (
      <p className="text-center text-gray-500 py-6">No orders found.</p>
    ) : (
      orderData.map((item, i) => (
        <div
          key={i}
          className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          {/* Order Item Details */}
          <div className="flex items-start gap-6 text-sm">
            {/* Display both images side by side */}
            <div className="flex gap-2">
              {item.images.map((imgSrc, imgIndex) => (
                <img
                  key={imgIndex}
                  src={imgSrc || "https://via.placeholder.com/150"}
                  className="w-16 sm:w-20 rounded"
                  alt={item.name}
                />
              ))}
            </div>

            {/* Order Information */}
            <div>
              <p className="sm:text-base font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.description}</p>

              {/* Order Details */}
              <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                <p>{currency}{item.price || "N/A"}</p>
                <p>Quantity: {item.quantity || "N/A"}</p>
                <p>Size: {item.size || "N/A"}</p>
              </div>
              
              <p className="mt-1">
                Date: <span className="text-gray-400">{item.date ? new Date(item.date).toDateString() : "N/A"}</span>
              </p>
              <p className="mt-1">
                Payment: <span className="text-gray-400">{item.paymentMethod || "N/A"}</span>
              </p>
            </div>
          </div>

          {/* Order Status & Tracking */}
          <div className="md:w-1/2 flex justify-between">
            <div className="flex items-center gap-2">
              <p className={`w-3 h-3 rounded-full ${item.status === "Delivered" ? "bg-green-500" : "bg-yellow-500"}`}></p>
              <p className="text-sm md:text-base">{item.status || "Pending"}</p>
            </div>

            {/* Track Order Button */}
            <button
              onClick={() => navigate(`/track/${item.orderId}`)}
              className="border px-4 py-2 text-sm text-medium rounded-sm hover:bg-gray-100"
            >
              Track Order
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
};

export default Orders;
