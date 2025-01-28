import React, { useContext, useState } from 'react'
import {useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art4 = () => {
  const { products } = useContext(ShopContext);
  const [art4, setArt4] = useState([]);

  useEffect(() => {
    const bestProducts = products.filter((item) => item.art4);
    setArt4(bestProducts.slice(0, 5));
  }, [products]);
  const handleOnClick = () => {
    navigate('/artisiti');
  };
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          officiis eaque sint, fugit quo laborum.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
        {art4.map((item, i) => (
          <ProductItem
            key={i}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            onClick={handleOnClick}  // Fixed camelCase and function usage

          />
        ))}
      </div>
    </div>
  );
};

export default Art4;