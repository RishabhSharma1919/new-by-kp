import React, { useContext } from 'react';
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer hover:underline">
      <div className="overflow-hidden">
        <img
          src={image?.[0] || "fallback-image-url.jpg"}  // Fallback image URL
          alt={`Product image of ${name}`}
          className="hover:scale-110 transition ease-in-out"
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}{parseFloat(price).toFixed(2)}  {/* Format price */}
      </p>
    </Link>
  );
};

export default ProductItem;
