import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";
import { ExpenseType, IndividualExpenseFromDataBaseType } from "@/lib/types";

export
    function sanitizeExpenses(expense: IndividualExpenseFromDataBaseType): ExpenseType {
    return {
        _id: expense._id.toString(),
        userId: expense.userId.toString(),
        amount: expense.amount,
        category: expense.category,
        currency: expense.currency,
        date: stringToDate(expense.date.toString()),
        description: expense.description,
        createdAt: expense.createdAt.toString(),
        updatedAt: expense.updatedAt.toString(),
        __v: expense.__v
    };
}