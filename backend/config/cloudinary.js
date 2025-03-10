// import { v2 as cloudinary } from "cloudinary";
// import { Readable } from "stream";

// const connectCloudinary = () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY,
//   });
// };

// const uploadImage = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { resource_type: "image" },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Upload Error:", error);
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );

//     const readableStream = new Readable();
//     readableStream.push(fileBuffer);
//     readableStream.push(null);
//     readableStream.pipe(uploadStream);
//   });
// };

// // ✅ Export as default
// export {connectCloudinary} ;
// export { uploadImage };


import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export default connectCloudinary;
