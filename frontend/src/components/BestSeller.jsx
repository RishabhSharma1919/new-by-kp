import React, { useContext, useMemo } from 'react';
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  // Memoized filtering for best sellers
  const bestSeller = useMemo(() => 
    (products || []).filter(item => item.bestSeller).slice(0, 5),
  [products]);
console.log("inside bestseller",bestSeller);
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our most popular products, loved by customers worldwide.
        </p>
      </div>

      {bestSeller.length === 0 ? (
        <p className="text-center text-gray-500">No best sellers available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSeller.map(item => (
            <ProductItem
              key={item._id}
              id={item._id}
              images={item.images}  // Fixed prop name for consistency
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSeller;
