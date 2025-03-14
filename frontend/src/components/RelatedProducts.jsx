import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { Card, CardContent } from "@/components/ui/card"; // ShadCN Card component

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      const filteredProducts = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filteredProducts.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-16 px-4">
      {/* TITLE */}
      <div className="text-center text-xl sm:text-2xl md:text-3xl py-2">
        <Title text1="RELATED" text2={`${category} - ${subCategory}`} />
      </div>

      {/* RELATED PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {related.length > 0 ? (
          related.map((item) => (
            <Card
              key={item._id}
              className="bg-[#E8E8E3] rounded-lg shadow-md cursor-pointer transition-transform duration-500 hover:scale-105"
              onClick={() => (window.location.href = `/product/${item._id}`)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="w-full min-h-40 sm:h-48 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-sm sm:text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-700 text-xs sm:text-sm">${item.price}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No related products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
