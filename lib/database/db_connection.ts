import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define the type for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global cache in dev to avoid multiple connections
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
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