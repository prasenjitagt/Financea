"use client"
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { useState } from "react";
import {
    ColumnDef,
    SortingState,
    getSortedRowModel,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FaDownload } from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InvoiceType } from "./columns";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]

}



export function InvoiceDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {


    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});


    //exporting excel sheet
    async function handleInvoicesExport() {
        try {
            let dataToBeExported: InvoiceType[];

            if (Object.keys(rowSelection).length === 0) {
                dataToBeExported = data as InvoiceType[];
            } else {
                dataToBeExported = data.filter((_, index) => rowSelection[index]) as InvoiceType[];
            }

            console.log(dataToBeExported);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Invoices");

            worksheet.columns = [
                { header: "Amount", key: "amount" },
                { header: "Client Name", key: "name" },
                { header: "Client Email", key: "email" },
                { header: "Invoice Number", key: "invoiceNumber" },
                { header: "Status", key: "status" },
                { header: "Currency", key: "currency" },
                { header: "Issue Date", key: "issueDate" },
                { header: "Due Date", key: "dueDate" },
            ];

            dataToBeExported.forEach(invoice => {
                worksheet.addRow({
                    amount: invoice.totalAmount,
                    name: invoice.clientName,
                    email: invoice.clientEmail,
                    invoiceNumber: invoice.invoiceNumber,
                    status: invoice.isPaid ? "Paid" : "Due",
                    currency: invoice.currency,
                    issueDate: new Date(invoice.issueDate).toLocaleDateString(),
                    dueDate: new Date(invoice.dueDate!).toLocaleDateString(),
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/octet-stream" });
            saveAs(blob, "invoices.xlsx");
        } catch (error) {
            console.log("Error Exporting ExcelSheet:", error);
        }
    }


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        },
    })



    return (
        <div className="flex flex-col h-full">


            {/* Top Table Utilities */}
            <div className="flex items-center justify-between py-4 space-x-4 sticky top-0 bg-white z-20">
                {/* Left: Search */}
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("clientName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                {/* Center: Selected Rows */}
                <div className="flex-1 text-center text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected
                </div>

                {/* Right: Visibility Dropdown and Export Button */}
                <section className="flex items-center space-x-2">
                    <Button
                        onClick={handleInvoicesExport}
                    >
                        <FaDownload className="mr-2" /> Export
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Visibility
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>

                    </DropdownMenu>
                </section>

            </div>


            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Buttons */}
            <div className="mt-auto flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
