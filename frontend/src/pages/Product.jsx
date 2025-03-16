// import React, { useContext, useEffect, useState } from "react"; 
// import { useParams } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";
// import RelatedProduct from "../components/RelatedProducts";
// import { assets } from "@/assets/assets";
// import axios from "axios";

// // ✅ Import ShadCN components
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
// import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(ShopContext);
//   const [productData, setProductData] = useState(null);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [description, setDescription] = useState("");
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [pincode, setPincode] = useState("");
//   const [pincodeMessage, setPincodeMessage] = useState(null);
//   const [isPincodeValid, setIsPincodeValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false); 

//   useEffect(() => {
//     const selectedProduct = products.find((item) => item._id === productId);
//     if (selectedProduct) {
//       setProductData(selectedProduct);
//       setSelectedImage(selectedProduct.images?.[0] || "fallback-image.jpg");
//     }
//   }, [productId, products]);

//   const isArtistProduct = productData?.art1 || productData?.art2 || productData?.art3 || productData?.art4 || productData?.art5;

//   // ✅ Function to Validate Pincode
//   const validatePincode = async () => {
//     if (!/^\d{6}$/.test(pincode)) {
//       setPincodeMessage("Please enter a valid 6-digit Indian pincode.");
//       setIsPincodeValid(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await response.json();

//       if (data[0]?.Status === "Success") {
//         setPincodeMessage("✔ This product is available in your area. COD is not available.");
//         setIsPincodeValid(true);
//       } else {
//         setPincodeMessage("❌ Invalid PIN code. Please enter a valid Indian pincode.");
//         setIsPincodeValid(false);
//       }
//     } catch (error) {
//       setPincodeMessage("❌ Could not verify PIN code. Try again later.");
//       setIsPincodeValid(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle Image Upload
//   const handleImageUpload = async (file) => {
//     if (!file) return;
//     setUploading(true); 
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await axios.post(`${backendurl}/api/upload/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.data.url) {
//         setUploadedImage(response.data.url);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return productData ? (
//     <div className="border-t-2 pt-10">
//       <Card className="p-6 shadow-lg">
//         <div className="flex gap-12 flex-col sm:flex-row">
//           {/* Left Section - Product Images */}
//           <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//             <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll">
//               {productData.images?.map((item, i) => (
//                 <img
//                   key={i}
//                   src={item || "fallback-image.jpg"}
//                   className="w-[24%] sm:w-full cursor-pointer"
//                   alt={`Product ${i}`}
//                   onClick={() => setSelectedImage(item)}
//                 />
//               ))}
//             </div>
//             <img src={selectedImage} className="w-full sm:w-[80%]" alt="Product" />
//           </div>

//           {/* Right Section - Product Details */}
//           <div className="flex-1">
//             <h1 className="font-medium text-2xl my-2">{productData.name}</h1>
//             <Badge variant="default">Best Seller</Badge>
//             <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
//             <p className="mt-5 text-gray-500">{productData.description}</p>

//             {/* Pincode Validation */}
//             <Input placeholder="Enter PIN code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
//             <Button onClick={validatePincode} disabled={loading} className="mt-2">
//               {loading ? "Checking..." : "Check Availability"}
//             </Button>
//             {pincodeMessage && (
//               <Alert className="mt-2">
//                 <AlertTitle>Status</AlertTitle>
//                 <AlertDescription>{pincodeMessage}</AlertDescription>
//               </Alert>
//             )}

//             {/* Artist Customization */}
//             {isArtistProduct && isPincodeValid && (
//               <div className="mt-5">
//                 <Textarea placeholder="Add artist description" value={description} onChange={(e) => setDescription(e.target.value)} />
                
//                 {/* Image Upload Dialog */}
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="mt-3">Upload Image</Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogTitle>Upload Your Image</DialogTitle>
//                     <DialogDescription>Select an image file to upload</DialogDescription>
//                     <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
//                   </DialogContent>
//                 </Dialog>

//                 {uploadedImage && <img src={uploadedImage} alt="Uploaded preview" className="mt-3 w-[200px] rounded shadow-lg" />}
//               </div>
//             )}

//             {/* ADD TO CART Button */}
//             {isPincodeValid && (
//               <Button disabled={uploading} onClick={() => addToCart({ itemId: productData._id, size: productData.size, price: productData.price, description, uploadedImage })} className="mt-5">
//                 {uploading ? "Uploading Image..." : "ADD TO CART"}
//               </Button>
//             )}

//             <Separator className="my-8" />
//             <Accordion type="single" collapsible>
//               <AccordionItem value="specs">
//                 <AccordionTrigger>Product Specifications</AccordionTrigger>
//                 <AccordionContent>
//                   <p>Size: {productData.size}</p>
//                   <p>Length: {productData.length} mm</p>
//                   <p>Breadth: {productData.breadth} mm</p>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>
//         </div>
//       </Card>
//       <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
//     </div>
//   ) : <Skeleton className="h-96 w-full" />;
// };

// export default Product;


import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProducts";
import { assets } from "@/assets/assets";
import axios from "axios";

// ✅ Import ShadCN components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import WishlistButton from "../components/WishlistButton"; 
import { useNavigate } from "react-router-dom";



// ✅ Import CameraPreview Component
import CameraPreview from "../components/CameraPreview";
import BuyNow from "./BuyNow";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart,backendUrl ,buynow,setbuyproduct,buyproduct} = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState(null);
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate inside the component


/*
const checkoutHandeler=async(amount)=>{
    console.log(amount);
    const {data:keyData}=await axios.get("api/payment/getkey");
    const {key}= keyData
    console.log(key);
    const {data:orderData}= await axios.post("/api/payment/process",{amount})
console.log(orderData);
    const{order}=orderData;
    console.log(order);
}
*/



  // ✅ Fetch product data from context
  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setSelectedImage(selectedProduct.images?.[0] || "/fallback-image.jpg");
    }
  }, [productId, products]);
//console.log("this is productdata",productData.images[0]);
  // ✅ Check if the product belongs to an artist category
  const isArtistProduct =
    productData?.art1 || productData?.art2 || productData?.art3 || productData?.art4 || productData?.art5;

  // ✅ Function to Validate Pincode
  const validatePincode = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMessage("❌ Please enter a valid 6-digit Indian pincode.");
      setIsPincodeValid(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === "Success") {
        setPincodeMessage("✔ Product is available in your area. COD is not available.");
        setIsPincodeValid(true);
      } else {
        setPincodeMessage("❌ Invalid PIN code. Please enter a valid Indian pincode.");
        setIsPincodeValid(false);
      }
    } catch (error) {
      setPincodeMessage("❌ Could not verify PIN code. Try again later.");
      setIsPincodeValid(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Image Upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${backendUrl}/api/upload/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.url) {
        setUploadedImage(response.data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Show skeleton loader if productData is not available
  if (!productData) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="border-t-2 pt-10">
    <Card className="p-6 shadow-lg">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Left Section - Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Scrollable Thumbnail List */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-w-full sm:h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {productData.images?.map((item, i) => (
              <img
                key={i}
                src={item || "/fallback-image.jpg"}
                className="w-[24%] sm:w-full cursor-pointer rounded-md border-2 hover:border-primary"
                alt={`Product ${i}`}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>
  
          {/* Active Image Display */}
          <img src={selectedImage} className="w-full sm:w-[80%] max-h-[400px] object-contain border border-gray-300 rounded-lg" alt="Product" />
        </div>

          {/* Right Section - Product Details */}
          <div className="flex-1">
            <h1 className="font-medium text-2xl my-2">{productData.name}</h1>
            <Badge variant="default">Best Seller</Badge>
            <p className="mt-5 text-3xl font-medium">
              {currency}
              {productData.price}
            </p>
            <p className="mt-5 text-gray-500">{productData.description}</p>

            {/* Pincode Validation */}
            <Input placeholder="Enter PIN code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
            <Button onClick={validatePincode} disabled={loading} className="mt-2">
              {loading ? "Checking..." : "Check Availability"}
            </Button>
            {pincodeMessage && (
              <Alert className="mt-2">
                <AlertTitle>Status</AlertTitle>
                <AlertDescription>{pincodeMessage}</AlertDescription>
              </Alert>
            )}

            {/* Artist Customization */}
            {isArtistProduct && isPincodeValid && (
              <div className="mt-5">
                <Textarea placeholder="Add artist description" value={description} onChange={(e) => setDescription(e.target.value)} />

                {/* Image Upload Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-3">
                      Upload Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Upload Your Image</DialogTitle>
                    <DialogDescription>Select an image file to upload</DialogDescription>
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                  </DialogContent>
                </Dialog>

                {uploadedImage && <img src={uploadedImage} alt="Uploaded preview" className="mt-3 w-[200px] rounded shadow-lg" />}
              </div>
            )}
     
            <WishlistButton productData={productData} />

            {/* ✅ Camera Preview Component */}
            {/* ✅ Camera Preview Component */}
{/* <div className="mt-5">
  <h2 className="text-lg font-semibold mb-2">Live Camera Preview</h2>
  <CameraPreview paintingSrc={productData.images[0]} />
</div> */}

{isPincodeValid && (
  <>
    <Button
      disabled={uploading}
      onClick={() =>
        addToCart({
          itemId: productData._id,
          size: productData.size,
          price: productData.price,
          description,
          uploadedImage,
        })
      }
      className="mt-5 mr-4" // Added right margin for spacing
    >
      {uploading ? "Uploading Image..." : "ADD TO CART"}
    </Button>


<Button
  disabled={uploading}
  onClick={async () => {
    const newProduct = {
      itemId: productData._id,
      price: productData.price,
      description,
     image: uploadedImage,
    };
    
    await setbuyproduct(newProduct); // Ensure the state updates
   // console.log("buyproduct after set:", newProduct);
    
    navigate("/buynow");
    //()=>checkoutHandeler(200) // Navigate after updating state
  }}
  className="mt-5"
>
  {uploading ? "Uploading Image..." : "BUY NOW"}
</Button>

  </>
)}


            <Separator className="my-8" />
            <Accordion type="single" collapsible>
              <AccordionItem value="specs">
                <AccordionTrigger>Product Specifications</AccordionTrigger>
                <AccordionContent>
                  <p>Size: {productData.size}</p>
                  <p>Length: {productData.length} mm</p>
                  <p>Breadth: {productData.breadth} mm</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Card>
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
