import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI as string;

  try {
    // If already connected, don't attempt to connect again
    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB is already connected");
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error", error);
  }
}

export default connectDB;
