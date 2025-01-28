import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProduct(products.slice(0, 10));
    }
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="my-10 text-center">
        <p className="text-xl text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="my-10 ">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae ex
          velit, quae quo minima repudiandae
        </p>
      </div>

      {/* RENDERING PRODUCT */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProduct.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">Loading products...</div>
        ) : (
          latestProduct.map((item) => (
            <ProductItem
              key={item._id} // Use unique _id instead of index
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              alt={`Image of ${item.name}`} // Add alt text for images
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
