// lib/models/Clients.model.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IClient extends Document {
  clientName: string;
  companyName: string;
  email: string;
  mobile: string;
  address: string;
  postal: string;
  state: string;
  country: string;
  serviceCharge: number;
  website: string;
  isClientActive: boolean;
  userId: mongoose.Types.ObjectId;
}

const ClientSchema: Schema<IClient> = new Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    postal: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    serviceCharge: {
      type: Number,
      required: [true, "Service charge is required"],
      min: [0, "Service charge must be a positive number"],
    },
    website: {
      type: String,
      required: [true, "Website is required"],
      trim: true,
    },
    isClientActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Client = models.Client || model<IClient>("Client", ClientSchema);
