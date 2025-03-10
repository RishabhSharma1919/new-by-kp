import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art3 = () => {
  const { products } = useContext(ShopContext);

  const art3Products = useMemo(() => 
    (products || []).filter(item => item.art3).slice(0, 5),
  [products]);

  console.log("inside Art3", art3Products);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"MODERN"} text2={"ART"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Contemporary artworks inspired by modern styles and trends.
        </p>
      </div>

      {art3Products.length === 0 ? (
        <p className="text-center text-gray-500">No modern artworks available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {art3Products.map((item) => (
            <ProductItem key={item._id} id={item._id} images={item.images} name={item.name} price={item.price} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Art3;
