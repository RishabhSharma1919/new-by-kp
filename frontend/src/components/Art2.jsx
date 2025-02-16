import React, { useContext, useState } from 'react'
import {useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art2 = () => {
  const { products } = useContext(ShopContext);
  const [art2, setArt2] = useState([]);
  const navigate = useNavigate(); // Define navigate function

  if (art2.length === 0) {
    return <div>Loading...</div>; // Shows loading if no data is available
  }
  useEffect(() => {
    const bestProducts = products.filter((item) => item.art2); // Updated to filter based on 'art2'
    setArt1(bestProducts.slice(0, 5));
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
        {art2.map((item, i) => (
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

export default Art2;