import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, images, name, price }) => {
  const { currency } = useContext(ShopContext);
  // console.log("ProductItem Props:", { id, images, name, price });
  
  // Select the first available image or use a fallback
  const productImage = Array.isArray(images) && images.length > 0 
  ? images[0] 
  : "/fallback-image.jpg";
  
  //console.log('++++++++++++++++++++++++',productImage);
  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer hover:underline">
      <div className="overflow-hidden">
        <img
          src={productImage}
          alt={`Product image of ${name}`}
          className="hover:scale-110 transition ease-in-out w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency} {price ? parseFloat(price).toFixed(2) : "0.00"}
      </p>
    </Link>
  );
};

export default ProductItem;
