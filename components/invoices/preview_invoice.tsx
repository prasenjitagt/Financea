import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Separator } from "../ui/separator";
import { createInvoiceFormType } from "@/lib/zod/create_invoice_zod_schema";
import { useSession } from "next-auth/react";



interface PreviewInvoiceProps {
    formData: createInvoiceFormType;
}

export default function PreviewInvoice({ formData }: PreviewInvoiceProps) {

    const { data: session, status } = useSession();

    const username = status === "authenticated" ? (session.user.username) : ("Financea User");

    const {
        invoiceNumber,
        issueDate,
        dueDate,
        clientName,
        clientEmail,
        items,
        totalAmount,
        currency
    } = formData;

    const formattedIssueDate = issueDate
        ? new Date(issueDate).toLocaleDateString('en-US', {
            month: 'short',   // "May" (full month name)
            day: '2-digit',  // "05" (zero-padded)
            year: 'numeric'  // "2025"
        })
        : "";
    const formattedDueDate = dueDate
        ? new Date(dueDate).toLocaleDateString('en-US', {
            month: 'short',   // "May" (full month name)
            day: '2-digit',  // "05" (zero-padded)
            year: 'numeric'  // "2025"
        })
        : "";

    const currencySymbol = currency === "USD" ? "$" : "₹";

    return (
        <div>
            <nav className="mb-8">
                <h2 className='text-2xl font-semibold text-center'>Preview Invoice</h2>
            </nav>

            {/* Invoice Body */}
            <Card className="rounded-none border-x-0 border-y-[4px]  border-[#001342]">
                <CardHeader className="flex justify-between">
                    <CardTitle className="text-2xl">Invoice</CardTitle>

                    {/* User Logo */}
                    <Image
                        src="/FinanceaLogo.png"
                        alt="Invoice Logo"
                        width={100}
                        height={100}
                    />
                </CardHeader>

                <CardContent>
                    {/* Invoice Number and Issue Date */}
                    <section>
                        {/* Invoice Number */}
                        <div className="flex gap-1">
                            <p className="font-bold">Invoice Number:</p>
                            <p className="text-muted-foreground">{`#${invoiceNumber}`}</p>
                        </div>


                        {/* Issue Date */}
                        <div className="flex gap-1">
                            <p className="font-bold">Date:</p>
                            <p className="text-muted-foreground">{formattedIssueDate}</p>
                        </div>


                    </section>

                    <div className="h-16" />

                    {/* Billed From and Billed To */}
                    <section className="flex gap-32 ">
                        {/* Billed From*/}
                        <div >
                            <p className="font-bold">Billed From</p>
                            <p className="text-muted-foreground">{`${username}`}</p>
                        </div>


                        {/* Billed To */}
                        <div >
                            <p className="font-bold">Billed To</p>
                            <p className="text-muted-foreground">{

                                `${clientName === undefined ? "" : clientName}`

                            }</p>
                            <p className="text-muted-foreground">{

                                `${clientEmail === undefined ? "" : clientEmail}`

                            }</p>

                        </div>


                    </section>

                    <div className="h-16" />

                    {/*Total Amount and Due Date  */}
                    <h3 className="text-xl font-bold">

                        {

                            `${currencySymbol || "₹"} ${(totalAmount ?? 0).toFixed(2)} Due on ${formattedDueDate || "(SELECT DUE DATE)"}`

                        }


                    </h3>

                    <div className="h-5" />


                    {/* Item Details */}
                    <Table className="w-full text-sm">
                        <TableHeader className=" border-b-2 border-slate-600">
                            <TableRow  >
                                <TableHead className="font-bold" >Description</TableHead>
                                <TableHead className="font-bold">Quantity</TableHead>
                                <TableHead className="font-bold">Rate</TableHead>
                                <TableHead className="font-bold">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                items.map((item, index) => {

                                    const totalItemAmount = item.quantity * item.rate;
                                    const formattedRate = Number(item.rate ?? 0).toFixed(2);
                                    return (
                                        <TableRow className="text-muted-foreground" key={index}>
                                            <TableCell >{item.name || "Describe item"}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{`
                                            ${currencySymbol || "₹"} ${formattedRate}
                                            `}</TableCell>
                                            <TableCell>{
                                                `${currencySymbol || "₹"} ${(totalItemAmount ?? 0).toFixed(2)} 
                                            `}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>

                </CardContent>

                <CardFooter className="flex justify-end">
                    <section>
                        <Separator />
                        <div className="mt-3 flex gap-20 items-center  font-semibold">

                            <p >Amount Due:</p>
                            <p >{`${currencySymbol || "₹"} ${(totalAmount ?? 0).toFixed(2)}`}</p>
                        </div>
                    </section>
                </CardFooter>
            </Card>
        </div>
    )
}



