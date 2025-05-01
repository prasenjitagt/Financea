"use client"


import { ColumnDef } from "@tanstack/react-table";
import CopyIcon from "@/assets/icons/copy_clients_table_icon.svg";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { showToast } from "@/lib/helpers/clients_table/copied_to_clipboard_toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { invoices_route } from "@/lib/helpers/api-endpoints";
import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";
import { InvoiceType } from "@/lib/types";





export const columns: ColumnDef<InvoiceType>[] = [

    //select
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />

        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    //amount
    {
        accessorKey: "totalAmount",
        header: () => <p>Amount</p>,
        cell: ({ row }) => {

            const currency = row.original.currency;
            const amount = parseFloat(row.getValue("totalAmount"));
            const formattedCurrencyString = formatAmountToCurrency(amount, currency);

            return <div >{formattedCurrencyString}</div>;
        },

    },

    //name
    {
        accessorKey: "clientName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <p className="text-[14px]">{row.getValue("clientName")}</p>
        )
    },

    //payment status
    {
        accessorKey: "isPaid",
        header: "Status",
        cell: ({ row }) => {
            const isPaid = row.getValue("isPaid");

            return (
                <span
                    className={`px-2 py-1 text-xs rounded-full font-medium
                ${isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                >
                    {isPaid ? "Paid" : "Due"}
                </span>
            );
        },
    },

    //contact
    {
        id: "customerInfo",
        header: "Customer Information",
        cell: ({ row }) => {
            const invoice = row.original;
            return (
                <div className="flex flex-col text-[14px]">
                    <p className="">{invoice.clientName}</p>

                    <section className="flex space-x-2">
                        <p className="">{invoice.clientEmail}</p>
                        <Image
                            className="cursor-pointer"
                            src={CopyIcon}
                            alt="Copy-Icon"
                            width={16}
                            onClick={() => {
                                showToast("Email Copied");
                                navigator.clipboard.writeText(invoice.clientEmail);
                            }}
                        />
                    </section>
                </div >
            );
        },
    },


    //invoiceNo.
    {
        accessorKey: "invoiceNumber",
        header: "Invoice No.",
        cell: ({ row }) => {
            const invoiceNumber = row.original.invoiceNumber;

            return (
                <div className="flex space-x-2">
                    <p>{`#${invoiceNumber}`}</p>

                    <Image
                        className="cursor-pointer"
                        src={CopyIcon}
                        alt="Copy-Icon"
                        width={16}
                        onClick={() => {
                            showToast("Invoice Number Copied");
                            navigator.clipboard.writeText(invoiceNumber);
                        }}
                    />
                </div>
            );
        },
    },

    //Issue Date
    {
        accessorKey: "issueDate",
        header: "Issue Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("issueDate"));
            const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            return <p>{formattedDate}</p>;
        },
    },

    //Issue Date
    {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("dueDate"));
            const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            return <p>{formattedDate}</p>;
        },
    },

    // actions
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const invoice = row.original;
            return <InvoiceActions invoice={invoice} />
        },
    },


]


function InvoiceActions({ invoice }: { invoice: InvoiceType }) {
    const router = useRouter();

    const handleDeleteInvoice = async () => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete the Invoice?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete!",
        });

        if (confirmResult.isConfirmed) {
            try {
                // Send the invoiceId in the URL as a query parameter
                const res = await axios.delete(`${invoices_route}?invoiceId=${invoice._id}`);

                if (res.status === 200) {
                    showToast("Invoice deleted successfully");

                    router.refresh();
                }
            } catch (error) {
                console.error("Error deleting Invoice:", error);
                showToast("Error deleting Invoice");
            }
        }
    };


    const handleMarkAsPaid = async () => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "You want to Mark the Invoice as Paid?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, Mark as Paid!",
        });

        if (confirmResult.isConfirmed) {
            try {
                // Send the invoiceId in the URL as a query parameter
                const res = await axios.put(`${invoices_route}?invoiceId=${invoice._id}`);

                if (res.status === 200) {
                    showToast("Invoice Marked as Paid successfully");

                    router.refresh();
                }
            } catch (error) {
                console.error("Error Marking as Paid:", error);
                showToast("Error Marking as Paid");
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(invoice.invoiceNumber);

                        showToast("Invoice ID Copied");
                    }}
                >
                    Copy Invoice No.
                </DropdownMenuItem>

                {!invoice.isPaid && (<DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleMarkAsPaid}
                >
                    Mark As Paid
                </DropdownMenuItem>)}

                <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleDeleteInvoice}
                >
                    Delete Invoice
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}