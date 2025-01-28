import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProducts";

const Artisitsi = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [description1, setDescription1] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:w-[18.7%] w-full">
            {productData.image.map((item, i) => (
              <img
                src={item}
                key={i}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-medium text-2xl my-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

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

          {productData.category.includes("art1") && (
            <div>
              <input
                className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded"
                type="text"
                placeholder="Add artist description"
                required
                onChange={(e) => setDescription1(e.target.value)}
                value={description1}
              />
              <p className="mt-2 text-gray-500">
                For any other specific things: WhatsApp 123-456-7890
              </p>
            </div>
          )}

          <div className="mt-5">
            <p className="mb-2">Upload Your Image (Optional)</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-gray-300 p-2 rounded-md w-full max-w-[500px]"
            />
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="mt-3 w-[200px] rounded shadow-lg"
              />
            )}
          </div>

          <button
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-4"
            onClick={() => addToCart(productData._id, size, description1)}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Artisitsi;
