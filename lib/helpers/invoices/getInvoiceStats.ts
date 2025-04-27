import { InvoiceType } from "@/app/invoices/columns";

export interface InvoiceStatsReturnType {
    totalInvoices: number,
    totalInvoiceAmount: number,
    totalAmountINRClients: number,
    totalAmountUSDClients: number,
    totalOutstandingInvoices: number,
    totalOutstandingPayments: number,
    totalOutstandingAmountINRClients: number,
    totalOutstandingAmountUSDClients: number,

}

export function getInvoiceStats(invoiceData: InvoiceType[]): InvoiceStatsReturnType {

    const totalInvoices = invoiceData.length;

    const totalInvoiceAmount = invoiceData.reduce((sum, invoice) => sum + invoice.totalAmount!, 0);

    const totalAmountINRClients = invoiceData
        .filter((invoice) => invoice.currency === "INR") // Filter invoices where currency is INR
        .reduce((sum, invoice) => sum + invoice.totalAmount!, 0); // Sum up their totalAmount

    const totalAmountUSDClients = invoiceData
        .filter((invoice) => invoice.currency === "USD") // Filter invoices where currency is USD
        .reduce((sum, invoice) => sum + invoice.totalAmount!, 0); // Sum up their totalAmount



    // Calculate outstanding invoices and payments
    const outstandingInvoicesData = invoiceData.filter((invoice) => !invoice.isPaid);



    const totalOutstandingInvoices = outstandingInvoicesData.length;


    const totalOutstandingPayments = outstandingInvoicesData.reduce((sum, invoice) => sum + invoice.totalAmount!, 0);

    const totalOutstandingAmountINRClients = outstandingInvoicesData
        .filter((invoice) => invoice.currency === "INR") // Filter outstanding invoices where currency is INR
        .reduce((sum, invoice) => sum + invoice.totalAmount!, 0); // Sum up their totalAmount

    const totalOutstandingAmountUSDClients = outstandingInvoicesData
        .filter((invoice) => invoice.currency === "USD") // Filter outstanding invoices where currency is USD
        .reduce((sum, invoice) => sum + invoice.totalAmount!, 0); // Sum up their totalAmount


    const returnData = {
        totalInvoices,
        totalInvoiceAmount,
        totalAmountINRClients,
        totalAmountUSDClients,
        totalOutstandingInvoices,
        totalOutstandingPayments,
        totalOutstandingAmountINRClients,
        totalOutstandingAmountUSDClients
    }

    return returnData
}