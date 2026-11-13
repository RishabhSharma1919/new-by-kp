import axios from "axios";
import { useEffect, useState } from "react";
import {  currency } from "../App";
import { toast } from "react-toastify";
const backendUrl = (import.meta.env.VITE_BACKEND_URL || "https://new-by-kp.vercel.app").replace(/\/+$/, "");

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

const removeProduct = async (id) => {
  try {
    const response = await axios.post(
      backendUrl + `/api/product/remove/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* LIST TABLE TITLE */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border text-sm bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Size</b>
          <b>Best Seller</b>
          <b>Art Categories</b>
          <b className="text-center">Action</b>
        </div>

        {/* PRODUCT LIST */}
        {list.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            {/* Fixed image property */}
            <img className="w-12" src={item.images?.[0] || "/default-image.jpg"} alt="Product" />
            
            <p>{item.name}</p>
            <p>{item.category}</p>
            
            {/* Fixed subCategory property */}
            <p>{item.subCategory}</p> 
            
            <p>{currency}{item.price}</p>
            
            <p>{item.size || `${item.length} x ${item.breadth}`}</p>
            <p>{item.bestSeller ? "Yes" : "No"}</p>
            
            <div className="flex flex-wrap gap-1">
              {(() => {
                const artLabels = {
                  art1: "Personalised",
                  art2: "Modern",
                  art3: "Digital",
                  art4: "Classic",
                  art5: "Special",
                };
                const active = ["art1", "art2", "art3", "art4", "art5"]
                  .filter((art) => item[art])
                  .map((art) => artLabels[art]);
                return active.length ? (
                  active.map((label) => (
                    <span key={label} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">Standard</span>
                );
              })()}
            </div>
            
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg text-red-600"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
