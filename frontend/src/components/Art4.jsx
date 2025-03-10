import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art4 = () => {
  const { products } = useContext(ShopContext);

  const art4Products = useMemo(() => 
    (products || []).filter(item => item.art4).slice(0, 5),
  [products]);

  console.log("inside Art4", art4Products);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"CLASSIC"} text2={"MASTERPIECES"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Traditional artworks that stand the test of time.
        </p>
      </div>

      {art4Products.length === 0 ? (
        <p className="text-center text-gray-500">No classic masterpieces available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {art4Products.map((item) => (
            <ProductItem key={item._id} id={item._id} images={item.images} name={item.name} price={item.price} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Art4;
