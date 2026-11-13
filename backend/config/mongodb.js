import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ [MongoDB] MONGODB_URI environment variable is missing!");
    return;
  }

  try {
    const rawUri = process.env.MONGODB_URI.trim();
    const uri = rawUri.endsWith("/")
      ? `${rawUri}e-commerce_forever`
      : rawUri.includes("?") || rawUri.includes("e-commerce")
      ? rawUri
      : `${rawUri}/e-commerce_forever`;

    mongoose.connection.on("connected", () => {
      console.log("DB Connected 🦾🤷‍♂️");
    });

    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = !!db.connections[0].readyState;
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  }
};

export default connectDB;