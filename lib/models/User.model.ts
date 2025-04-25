import mongoose from "mongoose";

// 1. Define interface for TypeScript
interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create Schema
const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Won't be returned in queries unless explicitly requested
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// 3. Create Model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;