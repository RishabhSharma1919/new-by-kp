import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { token, currency,backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        toast.error("You must be logged in to view orders.");
        return;
      }

      const response = await axios.get(`${backendUrl}/api/order/userorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        let allOrders = [];

        response.data.orders.forEach((order) => {
          if (!order.items && !order.itemi) return;

          let combinedItems = [];

          order.items?.forEach((item) => {
            combinedItems.push({
              name: item.name ? `${item.name} i` : "",
              description: item.description || "No description available",
              images: item.image ? [item.image] : ["🛒"], // Fallback emoji if no image
              price: `${currency}${item.price} (Delivery Excluded)`,
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
              combinedItems[index].images.push(itemk.images?.[0] || "🛒");
              combinedItems[index].name += ` ${itemk.name || "Unnamed Product"} i`;
              combinedItems[index].description = itemk.description || combinedItems[index].description;
            } else {
              combinedItems.push({
                name: itemk.name ? `${itemk.name} ` : "Unnamed Product",
                description: itemk.description || "No description available",
                images: [itemk.images?.[0] || "🛒"],
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
     // console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 px-4">
      {/* Title */}
      <div className="text-center text-3xl font-semibold text-white">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {orderData.length === 0 ? (
          <p className="text-center text-gray-400 py-6 col-span-full">No orders found.</p>
        ) : (
          orderData.map((item, i) => (
            <div
              key={i}
              className="relative p-5 flex flex-col items-center border rounded-lg shadow-lg bg-[#262B2B] 
                         text-[#D6D6C7] bg-opacity-80 backdrop-blur-md transition-transform transform hover:scale-105"
            >
              {/* Order Images */}
              <div className="flex space-x-2">
                {item.images.map((imgSrc, imgIndex) => (
                  <div key={imgIndex} className="w-20 h-20 flex items-center justify-center border rounded-lg bg-gray-700">
                    {imgSrc === "🛒" ? (
                      <span className="text-3xl">{imgSrc}</span>
                    ) : (
                      <img src={imgSrc} alt={item.name} className="object-cover w-full h-full rounded" />
                    )}
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="text-center mt-3">
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
                <p className="mt-1 text-[#D6D6C7]">{item.price}</p>
                <p className="text-sm">Quantity: {item.quantity || "N/A"}</p>
                <p className="text-sm">Size: {item.size || "N/A"}</p>
              </div>

              {/* Order Status & Track Button */}
              <div className="flex justify-between items-center w-full mt-4">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    item.status === "Delivered" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
                
                <button
                  onClick={() => navigate(`/track/${item.orderId}`)}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
