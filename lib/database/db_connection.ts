import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Use global cache in dev to avoid multiple connections
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async (locationInformation: string = "unspecified") => {
  if (cached.conn) {
    console.log(`MongoDB already connected (cached) in no need to call in: ${locationInformation}`);
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected in ${locationInformation}`);
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB Connection Error", error);
    throw error;
  }
};

export default connectDB;
