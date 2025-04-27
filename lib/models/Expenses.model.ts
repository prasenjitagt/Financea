import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["INR", "USD"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  receiptUrl: {
    type: String,
  }
}, { timestamps: true });

const ExpenseModel = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
export default ExpenseModel;