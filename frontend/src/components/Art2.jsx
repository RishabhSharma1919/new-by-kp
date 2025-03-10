import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art2 = () => {
  const { products } = useContext(ShopContext);

  const art2Products = useMemo(() => 
    (products || []).filter(item => item.art2).slice(0, 5),
  [products]);

  console.log("inside Art2", art2Products);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"EXCLUSIVE"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore premium and rare artwork selections.
        </p>
      </div>

      {art2Products.length === 0 ? (
        <p className="text-center text-gray-500">No exclusive artworks available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {art2Products.map((item) => (
            <ProductItem key={item._id} id={item._id} images={item.images} name={item.name} price={item.price} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Art2;
