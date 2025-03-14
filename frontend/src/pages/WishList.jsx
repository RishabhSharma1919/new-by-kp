import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import WishlistButton from "../components/wishlistbutton"; // Ensure WishlistButton is imported

const Wishlist = () => {
  const { products, wishitems } = useContext(ShopContext);

  // Filtering wishlist products based on itemId match
  const wishlistProducts = useMemo(() => {
    return (products || []).filter((item) =>
      wishitems.some((wish) => wish.itemId === item._id)
    );
  }, [products, wishitems]);

  return (
    <div className="my-10 bg-[#262B2B] py-8 px-4 rounded-xl text-white">
      {/* TITLE */}
      <div className="text-center text-4xl sm:text-5xl md:text-5xl py-4 sm:py-6">
        <Title text1="YOUR" text2="WISHLIST" />
        <p className="w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-400">
          Your favorite products, all in one place!
        </p>
      </div>

      {/* EMPTY WISHLIST MESSAGE */}
      {wishlistProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 sm:px-6 py-4">
          {wishlistProducts.map((item) => (
            <Card
              key={item._id}
              className={cn(
                "relative w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] bg-[#1F2424] rounded-lg overflow-hidden shadow-lg cursor-pointer",
                "transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              )}
            >
              <CardContent className="p-3 sm:p-4">
                {/* Wishlist Button - Positioned on the top-right */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton productData={item} />
                </div>

                {/* Product Image */}
                <div
                  className="relative w-full h-[120px] sm:h-[140px] flex justify-center"
                  onClick={() => (window.location.href = `/product/${item._id}`)}
                >
                  <div className="absolute w-full h-full bg-cover bg-center rounded-t-md overflow-hidden">
                    <img
                      src={item.images?.[0] || "/fallback.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-2 text-center">
                  <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">${item.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
