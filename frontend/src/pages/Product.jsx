// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import RelatedProduct from "../components/RelatedProducts";
// import { assets } from "@/assets/assets";

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(ShopContext);
//   const [productData, setProductData] = useState(null);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");
//   const [description1, setDescription1] = useState("");
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [pincode, setPincode] = useState("");
//   const [pincodeMessage, setPincodeMessage] = useState(null);
//   const [isPincodeValid, setIsPincodeValid] = useState(false);
//   const [loading, setLoading] = useState(false); // ✅ Track loading state
//   // const [descriptionByUser, setDescriptionByUser] = useState("");
//   // const [imagesUser, setImagesUser] = useState([]);

//   const isArtistProduct = productData?.art1;

//   useEffect(() => {
//     const selectedProduct = products.find((item) => item._id === productId);
//     if (selectedProduct) {
//       setProductData(selectedProduct);
//       setImage(selectedProduct.images?.[0] || "fallback-image.jpg");
//     }
//   }, [productId, products]);

//   // ✅ Function to Validate Pincode with Loading State
//   const validatePincode = async () => {
//     if (!/^\d{6}$/.test(pincode)) {
//       setPincodeMessage("Please enter a valid 6-digit Indian pincode.");
//       setIsPincodeValid(false);
//       return;
//     }

//     setLoading(true); // Start loading
//     try {
//       const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await response.json();

//       if (data[0].Status === "Success") {
//         setPincodeMessage("✔ This product is available in your area. COD is not available.");
//         setIsPincodeValid(true);
//       } else {
//         setPincodeMessage("❌ Invalid PIN code. Please enter a valid Indian pincode.");
//         setIsPincodeValid(false);
//       }
//     } catch (error) {
//       console.error("Error fetching pincode data:", error);
//       setPincodeMessage("❌ Could not verify PIN code. Try again later.");
//       setIsPincodeValid(false);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//             {productData.images?.map((item, i) => (
//               <img
//                 loading="lazy"
//                 src={item || "fallback-image.jpg"}
//                 key={i}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                 alt={`Product thumbnail ${i}`}
//                 onClick={() => setImage(item)}
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img loading="lazy" src={image} className="w-full h-auto" alt="Product" />
//           </div>
//         </div>

//         <div className="flex-1">
//           <h1 className="font-medium text-2xl my-2">{productData.name}</h1>
//           <div className="flex items-center gap-1 mt-2">
//             {[...Array(4)].map((_, i) => (
//               <img key={i} className="w-3.5" src={assets.star_icon} alt="star" />
//             ))}
//             <img className="w-3.5" src={assets.star_dull_icon} alt="star" />
//             <p className="pl-2">(122)</p>
//           </div>
//           <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
//           <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

//  <p className="mt-3 text-gray-700">Size: {productData.size}</p>
//           <p className="mt-1 text-gray-700">Length: {productData.length} mm</p>
//           <p className="mt-1 text-gray-700">Breadth: {productData.breadth} mm</p>

//           {/* ✅ Pincode Validation Section */}
//           <div className="mt-5">
//             <input
//               type="text"
//               className="border p-2 rounded-md w-full max-w-[500px]"
//               placeholder="Enter PIN code"
//               value={pincode}
//               onChange={(e) => setPincode(e.target.value)}
//             />
//             <button
//               className={`bg-gray-200 px-4 py-2 mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//               onClick={validatePincode}
//               disabled={loading}
//             >
//               {loading ? "Checking..." : "Check Availability"}
//             </button>
//             {pincodeMessage && <p className="mt-2 text-gray-500">{pincodeMessage}</p>}
//           </div>

//           {/* ✅ Show ADD TO CART only if pincode is valid */}
       
//           {isArtistProduct && isPincodeValid && (
//             <div className="mt-5">
//               <input
//                 className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded"
//                 type="text"
//                 placeholder="Add artist description"
//                 required
//                 onChange={(e) => setDescription1(e.target.value)}
//                 value={description1}
//               />
//               <p className="mt-2 text-gray-500">For any other specific things: WhatsApp 123-456-7890</p>
//               <p className="mt-5">Upload Your Image (Optional)</p>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setUploadedImage(URL.createObjectURL(e.target.files[0]))}
//                 className="border border-gray-300 p-2 rounded-md w-full max-w-[500px]"
//               />
//               {uploadedImage && (
//                 <img src={uploadedImage} alt="Uploaded preview" className="mt-3 w-[200px] rounded shadow-lg" />
//               )}
//             </div>
//           )}
//              {isPincodeValid && (
//             <button
//               className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-5"
//               onClick={() => {
             
//                 const cartItem = {
//                   itemId: productData._id,
//                   size: size || productData.size,
//                   price: productData.price,
//                   description1,
//                   uploadedImage,
//                 };
//                 addToCart(cartItem);
//               }}
              
//             >
//               ADD TO CART
//             </button>
//           )}


//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>✔ 100% Original Product.</p>
//             <p>✔ Cash on delivery is available.</p>
//             <p>✔ Easy return & exchange within 7 days.</p>
//           </div>
//         </div>
//       </div>
//       <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;



import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProducts";
import { assets } from "@/assets/assets";
import axios from "axios";
const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState(null);
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setSelectedImage(selectedProduct.images?.[0] || "fallback-image.jpg");
    }
  }, [productId, products]);

  const isArtistProduct = productData?.art1 || productData?.art2 || productData?.art3 || productData?.art4 || productData?.art5;

  // ✅ Function to Validate Pincode
  const validatePincode = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMessage("Please enter a valid 6-digit Indian pincode.");
      setIsPincodeValid(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === "Success") {
        setPincodeMessage("✔ This product is available in your area. COD is not available.");
        setIsPincodeValid(true);
      } else {
        setPincodeMessage("❌ Invalid PIN code. Please enter a valid Indian pincode.");
        setIsPincodeValid(false);
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      setPincodeMessage("❌ Could not verify PIN code. Try again later.");
      setIsPincodeValid(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Image Upload
  const [uploading, setUploading] = useState(false); // Track image upload state

  const handleImageUpload = async (file) => {
    if (!file) return;
  
    setUploading(true); // Disable ADD TO CART button
    console.log("Uploading file:", file);
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await axios.post("http://localhost:4000/api/upload/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.url) {
        setUploadedImage(response.data.url);
        console.log("Image uploaded successfully:", response.data.url);
      } else {
        console.error("Image upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false); // Enable ADD TO CART button once upload is done
    }
  };
  
  
  
  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Left Section - Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images?.map((item, i) => (
              <img
                key={i}
                src={item || "fallback-image.jpg"}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product thumbnail ${i}`}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={selectedImage} className="w-full h-auto" alt="Product" />
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl my-2">{productData.name}</h1>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} className="w-3.5" src={assets.star_icon} alt="star" />
            ))}
            <img className="w-3.5" src={assets.star_dull_icon} alt="star" />
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Product Specifications */}
          <p className="mt-3 text-gray-700">Size: {productData.size}</p>
          <p className="mt-1 text-gray-700">Length: {productData.length} mm</p>
          <p className="mt-1 text-gray-700">Breadth: {productData.breadth} mm</p>

          {/* Pincode Validation */}
          <div className="mt-5">
            <input
              type="text"
              className="border p-2 rounded-md w-full max-w-[500px]"
              placeholder="Enter PIN code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button
              className={`bg-gray-200 px-4 py-2 mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={validatePincode}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
            {pincodeMessage && <p className="mt-2 text-gray-500">{pincodeMessage}</p>}
          </div>

          {/* Artist Customization */}
          {isArtistProduct && isPincodeValid && (
            <div className="mt-5">
              <input
                type="text"
                className="w-full max-w-[500px] px-3 py-2 border rounded"
                placeholder="Add artist description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <p className="mt-2 text-gray-500">For specific requests, WhatsApp 123-456-7890</p>

              <p className="mt-5">Upload Your Image (Optional)</p>
              <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      console.log("File detected:", e.target.files[0]);
      handleImageUpload(e.target.files[0]);
    } else {
      console.log("No file selected");
    }
  }}
  className="border p-2 rounded-md w-full max-w-[500px]"
/>

  {uploadedImage && <img src={uploadedImage} alt="Uploaded preview" className="mt-3 w-[200px] rounded shadow-lg" />}
            </div>
          )}

      {/* ADD TO CART Button */}
{isPincodeValid && (
 <button
 className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-5 ${
   uploading ? "opacity-50 cursor-not-allowed" : ""
 }`}
 onClick={() => {
   if (!uploading) {
     addToCart({
       itemId: productData._id,
       size: productData.size,
       price: productData.price,
       description,
       uploadedImage,
     });
   }
 }}
 disabled={uploading} // Button is disabled while uploading
>
 {uploading ? "Uploading Image..." : "ADD TO CART"}
</button>

)}


          <hr className="mt-8 sm:w-4/5" />
          <p className="text-sm text-gray-500 mt-5">✔ 100% Original Product.</p>
          <p className="text-sm text-gray-500 mt-5">✔ ✔ COD available. </p>
          <p className="text-sm text-gray-500 mt-5"> ✔ Easy return in 7 days.</p>
        </div>
      </div>
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : null;
};

export default Product;
