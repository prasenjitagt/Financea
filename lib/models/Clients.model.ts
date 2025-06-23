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
  note: string;
  website: string;
  isClientActive: boolean;
  userId: mongoose.Types.ObjectId;
  currency: string;
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
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email should be unique"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    mobile: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    postal: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
    },
    isClientActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
    }
  },
  {
    timestamps: true,
  }
);

export const Client = models.Client || model<IClient>("Client", ClientSchema);
