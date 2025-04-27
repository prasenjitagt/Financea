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
import ReceiptIcon from "@/assets/icons/receipt_icon.svg";
import { useState, useEffect } from "react";
import PaymentRequestsLoading from "@/components/loading_ui/PaymentRequestsLoading";
import { payments_request_route } from "@/lib/helpers/api-endpoints";
import axios from "axios";
import { InvoiceType } from "@/app/invoices/columns";
import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";
import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";
import PaymentRequestsTable from "./payment_requests_table";
import Image from "next/image";

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

      {
        invoices.length === 0 ? (

          <div className=" h-full flex flex-col items-center justify-center">
            <Image src={ReceiptIcon} alt="Receipt Icon" width={100} />
            <h2 className="text-[25px]">No Payments Yet!</h2>
            <p className="text-[17px] text-muted-foreground">Get started by adding some</p>
          </div>

        ) : (<PaymentRequestsTable invoices={invoices} />)
      }



    </div>
  );
};

export default PaymentRequests;
