import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filteredProducts.slice(0, 5));
      console.log("====",filteredProducts);
    }
  }, [products, category, subCategory]);  // Re-run effect when category or subCategory changes

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1="RELATED" text2={`${category} - ${subCategory}`} />
      </div>

      <div className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {related.length > 0 ? (
          related.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              images={item.images}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <div className="col-span-full text-center">No related products found.</div>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
