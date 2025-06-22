import { InvoiceType } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";
import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";

interface PaymentRequestsTableProps {
  invoices: InvoiceType[];
}
export default function PaymentRequestsTable({
  invoices,
}: PaymentRequestsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3 opacity-50">Amount</TableHead>
          <TableHead className="w-1/3 opacity-50">Status</TableHead>
          <TableHead className="w-1/3 opacity-50">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => {
          const formattedCurrencyString = formatAmountToCurrency(
            invoice.totalAmount,
            invoice.currency
          );
          const formattedDate = stringToDate(invoice.issueDate);
          const isPaymentPaid = invoice.isPaid;
          const PaymentStatus = invoice.isPaid === true ? "Paid" : "Due";

          return (
            <TableRow key={invoice._id} className="h-[50px]">
              <TableCell className="font-medium text-base">
                {formattedCurrencyString}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium
                        ${isPaymentPaid ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {PaymentStatus}
                </span>
              </TableCell>

              <TableCell>{formattedDate}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
