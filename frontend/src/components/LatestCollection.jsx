import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  // Memoized filtering for latest collection (assuming sorting by latest added)
  const latestProducts = useMemo(() => 
    (products || []).slice(0, 5),  // Fetching the latest 5 products
  [products]);

  console.log("inside latest collection", latestProducts);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our newest additions, handpicked for you.
        </p>
      </div>

      {latestProducts.length === 0 ? (
        <p className="text-center text-gray-500">No latest products available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map(item => (
            <ProductItem
              key={item._id}
              id={item._id}
              images={item.images}  // Consistent prop usage
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
