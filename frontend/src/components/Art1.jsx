import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const Art1 = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const art1Products = useMemo(() => 
    (products || []).filter(item => item.art1).slice(0, 10), // Increased items for better scrolling
  [products]);

  return (
    <div className="my-10 bg-[#D6D6C7] py-12 rounded-xl">
      <div className="text-center text-3xl py-8">
        <Title text1="PERSONALISED" text2="WORKS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover unique handcrafted artworks tailored just for you.
        </p>
      </div>

      {art1Products.length === 0 ? (
        <p className="text-center text-gray-500">No personalized artworks available.</p>
      ) : (
        <div className="relative px-6">
          {/* Scrollable Container */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-4">
            {art1Products.map((item) => (
              <Card
                key={item._id}
                className={cn(
                  "relative min-w-[250px] bg-[#E8E8E3] rounded-b-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-500",
                  "hover:scale-105 hover:shadow-2xl"
                )}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <CardContent className="p-4">
                  <div className="relative w-full h-48 flex justify-center">
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

export default Art1;
