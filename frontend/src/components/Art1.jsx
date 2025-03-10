import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Art1 = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  // Memoized filtering for art1 products
  const art1Products = useMemo(() => 
    (products || []).filter(item => item.art1).slice(0, 5),
  [products]);

  console.log("inside Art1", art1Products);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"PERSONALISED"} text2={"WORKS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover unique handcrafted artworks tailored just for you.
        </p>
      </div>

      {art1Products.length === 0 ? (
        <p className="text-center text-gray-500">No personalized artworks available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {art1Products.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              images={item.images}  // Kept it consistent with BestSeller
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Art1;
