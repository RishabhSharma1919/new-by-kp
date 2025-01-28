import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art1 = () => {
  const { products } = useContext(ShopContext);
  const [art1, setArt1] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      const bestProducts = products.filter((item) => item.art1); // Correct filtering condition
      setArt1(bestProducts.slice(0, 5)); // Corrected to update `art1`
      
    }
  }, [products]);

  const handleOnClick = () => {
    navigate('/artisiti');
  };

  // if (art1.length === 0) {
  //   return <div>Loading...</div>; // Shows loading if no data is available
  // }

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8"> {/* Temporary background to check visibility */}
        <Title text1={"PERSONALISED"} text2={"WORKS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          officiis eaque sint, fugit quo laborum.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {art1.map((item, i) => (
          <ProductItem
            key={i}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            onClick={handleOnClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Art1;
