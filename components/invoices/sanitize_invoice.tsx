import { IndividualInvoiceFromDataBaseType, InvoiceType } from "@/lib/types";

export function sanitizeInvoice(invoice: IndividualInvoiceFromDataBaseType): InvoiceType {
    return {
        _id: invoice._id.toString(),
        user: invoice.user.toString(),
        client: invoice.client.toString(),
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate instanceof Date ? invoice.issueDate.toISOString() : invoice.issueDate,
        dueDate: invoice.dueDate.toString(),
        clientEmail: invoice.clientEmail,
        clientName: invoice.clientName,
        clientMobile: Number(invoice.clientMobile),
        isRecurring: Boolean(invoice.isRecurring),
        recurringFrequency: invoice.recurringFrequency ?? undefined,
        recurringIssueDate: invoice.recurringIssueDate
            ? (invoice.recurringIssueDate instanceof Date ? invoice.recurringIssueDate.toISOString() : invoice.recurringIssueDate)
            : undefined,
        recurringDueDate: invoice.recurringDueDate
            ? (invoice.recurringDueDate instanceof Date ? invoice.recurringDueDate.toISOString() : invoice.recurringDueDate)
            : undefined,
        items: invoice.items.map((item) => ({
            ishourly: Boolean(item.ishourly),
            name: item.name,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            _id: item._id.toString(),
        })),
        discountPercent: Number(invoice.discountPercent),
        taxPercent: Number(invoice.taxPercent),
        note: invoice.note ?? undefined,
        terms: invoice.terms ?? undefined,
        subTotal: Number(invoice.subTotal),
        discountAmount: Number(invoice.discountAmount),
        taxAmount: Number(invoice.taxAmount),
        totalAmount: Number(invoice.totalAmount),
        createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : invoice.createdAt,
        updatedAt: invoice.updatedAt instanceof Date ? invoice.updatedAt.toISOString() : invoice.updatedAt,
        __v: invoice.__v ?? undefined,
        isPaid: invoice.isPaid,
        paymentId: invoice.paymentId,
        currency: invoice.currency
    };
}
