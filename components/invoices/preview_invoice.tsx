import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Separator } from "../ui/separator";
import { createInvoiceFormType } from "@/lib/zod/create_invoice_zod_schema";
import { useSession } from "next-auth/react";

interface PreviewInvoiceProps {
  formData: createInvoiceFormType;
}

export default function PreviewInvoice({ formData }: PreviewInvoiceProps) {
  const { data: session, status } = useSession();

  const username =
    status === "authenticated" ? session.user.username : "Financea User";

  const {
    invoiceNumber,
    issueDate,
    dueDate,
    clientName,
    clientEmail,
    items,
    totalAmount,
    currency,
  } = formData;

  const formattedIssueDate = issueDate
    ? new Date(issueDate).toLocaleDateString("en-US", {
        month: "short", // "May" (full month name)
        day: "2-digit", // "05" (zero-padded)
        year: "numeric", // "2025"
      })
    : "";
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        month: "short", // "May" (full month name)
        day: "2-digit", // "05" (zero-padded)
        year: "numeric", // "2025"
      })
    : "";

  const currencySymbol = currency === "USD" ? "$" : "₹";

  return (
    <div>
      <nav className="mb-4">
        <h2 className="text-lg\ font-medium text-center">Preview Invoice</h2>
      </nav>

      {/* Invoice Body */}
      <div className="flex justify-center px-2 sm:px-4">
        <Card className="w-full min-w-[440px] h-[786px] px-4 overflow-auto border-y-[2px] border-y-[#001342] rounded-none">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-xl font-medium">Invoice</CardTitle>

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
                <p className="font-normal text-sm">Invoice Number:</p>
                <p className="text-muted-foreground font-normal text-sm">{`#${invoiceNumber}`}</p>
              </div>

              {/* Issue Date */}
              <div className="flex gap-1">
                <p className="font-normal text-sm">Date:</p>
                <p className=" font-normal text-sm">{formattedIssueDate}</p>
              </div>
            </section>

            <div className="h-8" />

            {/* Billed From and Billed To */}
            <section className="flex gap-24 ">
              {/* Billed From*/}
              <div>
                <p className="text-muted-foreground font-normal text-sm">
                  Billed From
                </p>
                <p className="font-normal text-sm">{`${username}`}</p>
              </div>

              {/* Billed To */}
              <div>
                <p className="text-muted-foreground font-normal text-sm">
                  Billed To
                </p>
                <p className="font-normal text-sm">{`${clientName === undefined ? "" : clientName}`}</p>
                {/* <p className="text-muted-foreground font-normal text-sm">{`${clientEmail === undefined ? "" : clientEmail}`}</p> */}
              </div>
            </section>

            <div className="h-8" />

            {/*Total Amount and Due Date  */}
            <h3 className="font-medium text-base">
              {`${currencySymbol || "₹"} ${(totalAmount ?? 0).toFixed(2)} Due on ${formattedDueDate || "(SELECT DUE DATE)"}`}
            </h3>

            <div className="h-5" />

            {/* Item Details */}
            <Table className="w-full text-sm">
              <TableHeader className=" border-b-2 border-slate-600">
                <TableRow>
                  <TableHead className="text-muted-foreground font-normal text-sm">
                    Description
                  </TableHead>
                  <TableHead className="text-muted-foreground font-normal text-sm">
                    Quantity
                  </TableHead>
                  <TableHead className="text-muted-foreground font-normal text-sm">
                    Rate
                  </TableHead>
                  <TableHead className="text-muted-foreground font-normal text-sm">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const totalItemAmount = item.quantity * item.rate;
                  const formattedRate = Number(item.rate ?? 0).toFixed(2);
                  return (
                    <TableRow className="font-normal text-sm " key={index}>
                      <TableCell>{item.name || "Describe item"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{`
                                            ${currencySymbol || "₹"} ${formattedRate}
                                            `}</TableCell>
                      <TableCell>{`${currencySymbol || "₹"} ${(totalItemAmount ?? 0).toFixed(2)} 
                                            `}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>

          <CardFooter className="flex justify-end">
            <section>
              <Separator />
              <div className="mt-1 flex gap-20 items-center  font-medium text-base">
                <p>Amount Due:</p>
                <p>{`${currencySymbol || "₹"} ${(totalAmount ?? 0).toFixed(2)}`}</p>
              </div>
            </section>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
