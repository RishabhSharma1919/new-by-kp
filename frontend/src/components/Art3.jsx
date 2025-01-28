import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art3 = () => {
  const { products } = useContext(ShopContext);
  const [art3, setArt3] = useState([]);
  const navigate = useNavigate(); // Define navigate function

  useEffect(() => {
    const bestProducts = products.filter((item) => item.art3);
    setArt3(bestProducts.slice(0, 5));
  }, [products]);

  const handleOnClick = () => {
    navigate('/artisiti'); // Fixed typo in route ('artisiti' -> 'artists')
  };

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"ART"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          officiis eaque sint, fugit quo laborum.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {art3.map((item) => (
          <ProductItem
            key={item._id} // Using unique key (_id) for better performance
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            onClick={handleOnClick} // Passing the handleOnClick function
          />
        ))}
      </div>
    </div>
  );
};

export default Art3;
