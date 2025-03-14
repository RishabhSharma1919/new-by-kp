import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { cn } from "@/lib/utils"; // Utility for conditional classnames

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  // Fetch latest 10 products for better scrolling
  const latestProducts = useMemo(() => (products || []).slice(0, 10), [products]);

  return (
    <div className="my-10 bg-[#D6D6C7] py-10 rounded-lg">
      <div className="text-center text-4xl py-8">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our newest additions, handpicked for you.
        </p>
      </div>

      {latestProducts.length === 0 ? (
        <p className="text-center text-gray-500">No latest products available.</p>
      ) : (
        <div className="relative px-6">
          {/* Scrollable Container */}
          <div className="flex gap-6 overflow-x-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
            {latestProducts.map((item, index) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)} // Navigate to product page
                className={cn(
                  "relative min-w-[250px] bg-[#E8E8E3] p-4 rounded-b-lg rounded-t-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-500",
                  "hover:scale-105 hover:shadow-2xl",
                  index % 2 === 0 ? "animate-floating" : "animate-floating-reverse"
                )}
              >
                <div className="relative w-full h-48 flex justify-center">
                  {/* Semicircle image at the top */}
                  <div className="absolute w-full h-full bg-cover bg-center rounded-t-[50%] overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-gray-800 font-semibold">{item.name}</h3>
                  <p className="text-gray-700">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
