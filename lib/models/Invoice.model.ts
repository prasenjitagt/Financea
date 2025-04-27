// models/invoiceModel.ts

import { Schema, model, models, Document } from "mongoose";
import { Types } from "mongoose";
import { createInvoiceFormType } from "@/lib/zod/create_invoice_zod_schema"; // import your zod type!

// 1. Create a TypeScript type combining zod + _id
export interface InvoiceType extends createInvoiceFormType {
  user: Types.ObjectId;
  client: Types.ObjectId;
  isPaid: boolean;
  paymentId: string;
}

// 2. Mongoose Document type
export interface InvoiceDocument extends InvoiceType, Document { }

const invoiceSchema = new Schema<InvoiceDocument>(
  {

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientMobile: {
      type: Number,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      required: true,
    },
    recurringFrequency: {
      type: String,
      enum: ["Weekly", "Monthly", "Quarterly", "Yearly"],
      required: false,
    },
    recurringIssueDate: {
      type: Date,
      required: false,
    },
    recurringDueDate: {
      type: Date,
      required: false,
    },
    items: [
      {
        ishourly: { type: Boolean, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
      },
    ],
    discountPercent: {
      type: Number,
      required: true,
    },
    taxPercent: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentId: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const InvoiceModel =
  models.Invoice || model<InvoiceDocument>("Invoice", invoiceSchema);

export default InvoiceModel;
