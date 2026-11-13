import mongoose from "mongoose";

let isConnected = false;

const DEFAULT_MONGODB_URI = "mongodb+srv://sharmarish9826:8vDVvBKXwLxhHdaP@cluster0.emunz.mongodb.net/e-commerce_forever";

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const rawUri = (process.env.MONGODB_URI || DEFAULT_MONGODB_URI).trim();

  try {
    const uri = rawUri.endsWith("/")
      ? `${rawUri}e-commerce_forever`
      : rawUri.includes("?") || rawUri.includes("e-commerce")
      ? rawUri
      : `${rawUri}/e-commerce_forever`;

    mongoose.connection.on("connected", () => {
      console.log("DB Connected 🦾🤷‍♂️");
    });

    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 7000,
    });
    isConnected = !!db.connections[0].readyState;
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  }
};

export default connectDB;
