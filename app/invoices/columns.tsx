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
import { clients_route } from "@/lib/helpers/api-endpoints";

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

}


export const columns: ColumnDef<ClientType>[] = [

    //seletc
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

    //status
    {
        accessorKey: "isClientActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("isClientActive");

            return (
                <span
                    className={`px-2 py-1 text-xs rounded-full font-medium
                ${isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                >
                    {isActive ? "Active" : "Inactive"}
                </span>
            );
        },
    },


    //contact
    {
        id: "contact",
        header: "Contact",
        cell: ({ row }) => {
            const client = row.original;
            return (
                <div className="flex flex-col text-[14px]">
                    <section className="flex space-x-2">
                        <p className="">{client.mobile}</p>
                        <Image
                            className="cursor-pointer"
                            src={CopyIcon}
                            alt="Copy-Icon"
                            width={16}
                            onClick={() => {
                                showToast("Phone Number Copied");
                                navigator.clipboard.writeText(client.mobile);
                            }}
                        />
                    </section>
                    <section className="flex space-x-2">
                        <p className="">{client.email}</p>
                        <Image
                            className="cursor-pointer"
                            src={CopyIcon}
                            alt="Copy-Icon"
                            width={16}
                            onClick={() => {
                                showToast("Email Copied");
                                navigator.clipboard.writeText(client.email);
                            }}
                        />
                    </section>
                </div>
            );
        },
    },

    //website
    {
        accessorKey: "website",
        header: "Website",

    },

    //country
    {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => {
            const country = row.getValue("country") as string;
            const flagMap: { [key: string]: string } = {
                USA: "🇺🇸",
                India: "🇮🇳",
                UK: "🇬🇧",
            };

            return (
                <div className="flex items-center gap-2 text-[14px]">
                    <span>{flagMap[country] || "🏳️"}</span>
                    <span>{country}</span>
                </div>
            );
        },
    },

    //service charge
    {
        accessorKey: "serviceCharge",
        header: () => <p>Service Charge</p>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("serviceCharge"));
            const country = row.original.country;

            const currencyMap: Record<string, string> = {
                India: "INR",
                USA: "USD",
                UK: "GBP",
            };

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currencyMap[country] || "USD",
            }).format(amount);

            return <div >{formatted}</div>;
        },
    }
    ,

    //Date
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            return <p>{formattedDate}</p>;
        },
    },

    //actions
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const client = row.original;
            const router = useRouter();

            const handleDelete = async () => {
                const confirmResult = await Swal.fire({
                    title: "Are you sure?",
                    text: "You want to delete the client?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Yes, delete!",
                });

                if (confirmResult.isConfirmed) {
                    try {
                        // Send the clientId in the URL as a query parameter
                        const res = await axios.delete(`${clients_route}?clientId=${client._id}`);

                        if (res.status === 200) {
                            showToast("Client deleted successfully");

                            router.refresh();
                        }
                    } catch (error) {
                        console.error("Error deleting client:", error);
                        showToast("Error deleting client");
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

                                navigator.clipboard.writeText(client._id);
                            }}
                        >
                            Copy Client ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push(`/clients/profile?id=${client._id}`)}
                        >
                            View Client
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleDelete}
                        >
                            Delete Client
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
