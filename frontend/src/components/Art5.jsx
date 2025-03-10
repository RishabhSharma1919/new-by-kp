import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art5 = () => {
  const { products } = useContext(ShopContext);

  const art5Products = useMemo(() => 
    (products || []).filter(item => item.art5).slice(0, 5),
  [products]);

  console.log("inside Art5", art5Products);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"ABSTRACT"} text2={"CREATIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Dive into the world of imagination with abstract art.
        </p>
      </div>

      {art5Products.length === 0 ? (
        <p className="text-center text-gray-500">No abstract creations available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {art5Products.map((item) => (
            <ProductItem key={item._id} id={item._id} images={item.images} name={item.name} price={item.price} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Art5;
