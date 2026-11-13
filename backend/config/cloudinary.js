import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || "ds0mj4fng",
    api_key: process.env.CLOUDINARY_API_KEY || "767262496799359",
    api_secret: process.env.CLOUDINARY_SECRET_KEY || "jk83-AtOxo4yj8-shD7Ra21vUe4",
  });
};

export default connectCloudinary;
