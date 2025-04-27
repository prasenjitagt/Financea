"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState, useEffect } from "react";
import PaymentRequestsLoading from "@/components/loading_ui/PaymentRequestsLoading";
import { payments_request_route } from "@/lib/helpers/api-endpoints";
import axios from "axios";
import { InvoiceType } from "@/app/invoices/columns";
import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";
import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-600",
  Overdue: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-600",
};

const PaymentRequests = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get<InvoiceType[]>(payments_request_route); // Replace with actual API URL

        setInvoices(response.data);


      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <PaymentRequestsLoading />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md mt-6 md:h-[34.3rem]">

      {/* Header Section */}
      <div className=" items-center mb-4">
        <h2 className="text-lg font-semibold text-black">Payment Requests</h2>
      </div>


      <Table>
        <TableCaption>A list of your Recent Paymetns</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3" >Amount</TableHead>
            <TableHead className="w-1/3" >Status</TableHead>
            <TableHead className="w-1/3" >Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {

            const formattedCurrencyString = formatAmountToCurrency(invoice.totalAmount, invoice.currency);
            const formattedDate = stringToDate(invoice.issueDate);
            const isPaymentPaid = invoice.isPaid;
            const PaymentStatus = invoice.isPaid === true ? "Paid" : "Due";

            return (
              <TableRow key={invoice._id} className="h-[50px]">
                <TableCell className="font-medium">{formattedCurrencyString}</TableCell>
                <TableCell >
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium
                        ${isPaymentPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {PaymentStatus}
                  </span>
                </TableCell>

                <TableCell>{formattedDate}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>

      </Table>

    </div>
  );
};

export default PaymentRequests;
