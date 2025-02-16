import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image?.[0] || "fallback-image.jpg"); // Fallback if image is missing
    }
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* PRODUCT DATA */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* PRODUCT IMAGE SELECTION */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image?.map((item, i) => (
              <img
                loading="lazy"
                src={item || "fallback-image.jpg"}
                key={i}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product thumbnail ${i}`}
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              loading="lazy"
              src={image}
              className="w-full h-auto"
              alt="Product"
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl my-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} className="w-3.5" src="/assets/star_icon.png" alt="star" />
            ))}
            <img className="w-3.5" src="/assets/star_dull_icon.png" alt="star" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* 🔥 DEBUG: Check if sizes exist */}
          <p className="text-red-500 text-sm">
            Sizes: {productData.sizes ? JSON.stringify(productData.sizes) : "No sizes available"}
          </p>

          {/* SIZE SELECTION FIX */}
          {productData.sizes && productData.sizes.length > 0 ? (
            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, i) => (
                  <button
                    className={`border py-2 px-4 bg-gray-100 ${
                      item === size ? "border-orange-500" : ""
                    }`}
                    key={i}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">Size options not available for this product.</p>
          )}

          {/* ADD TO CART BUTTON */}
          <button
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            onClick={() => {
              if (!size && productData.sizes?.length > 0) {
                alert("Please select a size before adding to cart!");
                return;
              }
              
              addToCart(productData._id, productData.sizes[0],productData?.price);
            }}
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>✔ 100% Original Product.</p>
            <p>✔ Cash on delivery is available.</p>
            <p>✔ Easy return & exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION & REVIEW SECTION */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm ">Description</b>
          <p className="border px-5 py-3 text-sm ">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
            dolor, consequuntur totam nostrum praesentium distinctio accusamus
            assumenda architecto alias veritatis autem. Non facilis alias
            quaerat quasi cumque nisi. Suscipit cupiditate perspiciatis
            laudantium error quibusdam facere, praesentium delectus cum rerum
            tempore laboriosam temporibus. Id voluptatibus quia, optio provident
            nesciunt debitis. Harum!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui quos
            deleniti corrupti dolore commodi deserunt, dicta ipsam ex nemo
            animi.
          </p>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
