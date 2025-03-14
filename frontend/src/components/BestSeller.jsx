import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { cn } from "@/lib/utils"; // Utility for conditional classnames
import { Card, CardContent } from "@/components/ui/card"; // ShadCN Card component

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  // Filtering best sellers
  const bestSeller = useMemo(() => 
    (products || []).filter(item => item.bestSeller).slice(0, 10), // Increased items for better scrolling
  [products]);

  //console.log("Inside bestseller", bestSeller);

  return (
    <div className="my-10 bg-[#D6D6C7] py-12 rounded-xl">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our most popular products, loved by customers worldwide.
        </p>
      </div>

      {bestSeller.length === 0 ? (
        <p className="text-center text-gray-500">No best sellers available.</p>
      ) : (
        <div className="relative px-6">
          {/* Scrollable Container */}
          <div className="flex gap-6 overflow-x-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
            {bestSeller.map((item) => (
              <Card
                key={item._id}
                className={cn(
                  "relative min-w-[250px] bg-[#E8E8E3] rounded-b-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-500",
                  "hover:scale-105 hover:shadow-2xl"
                )}
                onClick={() => window.location.href = `/product/${item._id}`} // Navigate to product page
              >
                <CardContent className="p-4">
                  <div className="relative w-full h-48 flex justify-center">
                    {/* Image with semicircle top */}
                    <div className="absolute w-full h-full bg-cover bg-center rounded-t-[5%] rounded-b-[5%] overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-700">${item.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
