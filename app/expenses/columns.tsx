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
import { expenses_route } from "@/lib/helpers/api-endpoints";
import { ExpenseType } from "@/lib/types";
import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";
import { ExpenseCategoryColor } from "@/lib/constants/expenses_constants";
import { truncateString } from "@/lib/helpers/expenses_table/truncate_string";





export const columns: ColumnDef<ExpenseType>[] = [

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
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const expense = row.original;
            const amountToDisplay = formatAmountToCurrency(expense.amount, expense.currency)
            return (
                <p>
                    {amountToDisplay}
                </p>
            )
        }


    },

    //category 
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;

            return (
                <div className="flex items-center space-x-2">
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: ExpenseCategoryColor[category] }}
                    />
                    <div className="text-gray-800 text-sm">{category}</div>
                </div>
            );
        },
    },


    //Expense Date
    {
        accessorKey: "date",
        header: "Date"
    },




    //Description
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const descripton = row.original.description;

            const concatedDescription = truncateString(descripton, 50);

            return (
                <p>
                    {concatedDescription}
                </p>
            );
        },
    },


    //actions
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const expense = row.original;
            return <ExpensesActions expense={expense} />;
        },
    },
]


function ExpensesActions({ expense }: { expense: ExpenseType }) {
    const router = useRouter();

    const handleDelete = async () => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete the expense?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete!",
        });

        if (confirmResult.isConfirmed) {
            try {
                // Send the expenseId in the URL as a query parameter
                const res = await axios.delete(`${expenses_route}?clientId=${expense._id}`);

                if (res.status === 200) {
                    showToast("Expense deleted successfully");

                    router.refresh();
                }
            } catch (error) {
                console.error("Error deleting expense:", error);
                showToast("Error deleting expense");
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
                        showToast("Client ID Copied");

                        navigator.clipboard.writeText(expense._id);
                    }}
                >
                    Copy Expense ID
                </DropdownMenuItem>

                <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleDelete}
                >
                    Delete Expense
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
