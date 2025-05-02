//lib/types.ts

import { ObjectId } from 'mongodb';
import { StaticImageData } from 'next/image';

//resposne from razorpay after generating invoice and sending payment link
export interface RazorpayPaymentLinkResponseType {
    accept_partial: boolean;
    amount: number;
    amount_paid: number;
    cancelled_at: number;
    created_at: number;
    currency: string;
    customer: {
        contact: string;
        email: string;
        name: string;
    };
    description: string;
    expire_by: number;
    expired_at: number;
    first_min_partial_amount: number;
    id: string;
    notes: {
        source: string,
        [key: string]: string | number | boolean;
    };
    notify: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
    };
    // payments: any | null;
    reference_id: string;
    reminder_enable: boolean;
    // reminders: any[];
    short_url: string;
    status: "created" | "paid" | "cancelled" | "expired";  // Possible status values
    updated_at: number;
    upi_link: boolean;
    user_id: string;
    whatsapp_link: boolean;
}


export interface RazorpayPaymentLinkPayloadType {
    amount: number;
    currency: string;
    description: string;
    customer: {
        name: string;
        email: string;
        contact: string;
    };
    notify: {
        sms: boolean;
        email: boolean;
        whatsapp?: boolean; // Optional if you might use it
    };
    reminder_enable: boolean;
    notes: {
        source: string;
        [key: string]: string | number | boolean; // For additional note fields
    };
    expire_by: number;
}



//Individual Client Type for Client Components
export interface ClientType {
    _id: string;
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
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


//Individual Client Type for Server Components
export interface IndividualClientFromDataBaseType {
    _id: ObjectId | string;
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
    userId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}


type Currency = 'INR' | 'USD' | string; // Add other currencies you support
type RecurringFrequency = 'Weekly' | 'Monthly' | 'Yearly' | 'Quarterly';

//Individual Invoice Item Type for Client Components
interface InvoiceItem {
    _id: string; // Changed from ObjectId to string
    ishourly: boolean;
    name: string;
    quantity: number;
    rate: number;
}


//Individual Invoice Type for Client Components
export interface InvoiceType {
    _id: string; // Changed from ObjectId to string
    user: string; // Changed from ObjectId to string
    client: string; // Changed from ObjectId to string
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    clientEmail: string;
    clientName: string;
    clientMobile: number;
    isRecurring: boolean;
    recurringFrequency?: 'Weekly' | 'Monthly' | 'Yearly' | 'Quarterly';
    recurringIssueDate?: string;
    recurringDueDate?: string;
    items: InvoiceItem[];
    discountPercent: number;
    taxPercent: number;
    note?: string;
    terms?: string;
    subTotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    isPaid: boolean;
    paymentId?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}


//Individual Invoice Item Type for Server Components
interface InvoiceItemFromDataBaseType {
    _id: ObjectId;
    ishourly: boolean;
    name: string;
    quantity: number;
    rate: number;
}

//Individual Invoice Type for Server Components
export interface IndividualInvoiceFromDataBaseType {
    _id: ObjectId;
    user: ObjectId;
    client: ObjectId;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    clientEmail: string;
    clientName: string;
    clientMobile: number;
    isRecurring: boolean;
    recurringFrequency?: RecurringFrequency;
    recurringIssueDate?: Date;
    recurringDueDate?: Date;
    items: InvoiceItemFromDataBaseType[];
    discountPercent: number;
    taxPercent: number;
    note?: string;
    terms?: string;
    subTotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    currency: Currency;
    isPaid: boolean;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

//Individual Expense Type for Client Components
export interface ExpenseType {
    _id: string;
    userId: string;
    amount: number;
    currency: string;
    date: string;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


//Individual Expense Type for Server Components
export interface IndividualExpenseFromDataBaseType {
    _id: ObjectId;
    userId: ObjectId;
    amount: number;
    currency: string;
    date: Date;
    category: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

//financial metrics periods type
interface FinancialMetricsCurrentPeriod {
    totalRevenue: number;
    totalProfitOrLoss: number;
    totalDues: number;
    isProfit: boolean;
    profitPercentage: number;
    totalExpenses: number;
    outstandingInvoiceAmount: number;
    outstandingInvoiceCount: number;
}


interface FinancialMetricsPrevPeriod {
    totalRevenue: number;
    totalProfitOrLoss: number;
    totalDues: number;
    isProfit: boolean;
    profitPercentage: number;
    totalExpenses: number;
}
//financial metrics respose to frontend type
export interface FinancialMetricsResponseType {
    currentPeriod: FinancialMetricsCurrentPeriod;
    previousPeriod: FinancialMetricsPrevPeriod;
    interval: 'daily' | 'monthly' | 'quarterly' | 'yearly';
}

interface SideBarSubMenuItemType {
    title: string,
    path: string,
}


//sidebar menu item type
export interface SideBarMenuItemType {
    title: string,
    icon: StaticImageData,
    path: string,
    isActive?: boolean
    subMenuItems?: SideBarSubMenuItemType[]
}