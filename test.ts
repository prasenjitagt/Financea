// "use client";

// import { useState, useEffect } from "react";
// import PaymentRequestsLoading from "@/components/loading_ui/PaymentRequestsLoading";
// import { payments_request_route } from "@/lib/helpers/api-endpoints";
// import axios from "axios";
// import { InvoiceType } from "@/app/invoices/columns";
// import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";
// import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";

// const statusColors: Record<string, string> = {
//   Paid: "bg-green-100 text-green-600",
//   Overdue: "bg-red-100 text-red-600",
//   Pending: "bg-yellow-100 text-yellow-600",
// };

// const PaymentRequests = () => {
//   const [invoices, setInvoices] = useState<InvoiceType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const response = await axios.get<InvoiceType[]>(payments_request_route); // Replace with actual API URL

//         setInvoices(response.data);


//       } catch (error) {
//         setError((error as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoices();
//   }, []);

//   if (loading) return <PaymentRequestsLoading />;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="bg-white p-5 rounded-xl shadow-md mt-6 md:h-[34.3rem]">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-black">Payment Requests</h2>
//         <select className="border px-3 py-1.5 rounded-lg text-black text-sm">
//           <option>All Status</option>
//         </select>
//       </div>

//       {/* Table Header */}
//       <div className="flex justify-between pb-2 border-b text-gray-500 text-sm font-semibold">
//         <span>Amount</span>
//         <span className="w-24 ml-[9rem]">Date</span>
//         <span>Status</span>
//       </div>

//       {/* Payment List */}
//       <div className="w-full">
//         {invoices.length > 0 ? (
//           invoices.map((invoice, index) => {

//             const formattedDate = stringToDate(invoice.issueDate);
//             const formattedCurrencyString = formatAmountToCurrency(invoice.totalAmount, invoice.currency);
//             return (
//               <div key={index} className="flex justify-between items-center border-b py-4 last:border-none md:gap-0 gap-3">
//                 <div>
//                   <p className="text-sm font-bold">{formattedCurrencyString}</p>
//                 </div>
//                 <p className="text-gray-600 text-sm text-center w-24">{formattedDate}</p>
//                 <span className={`px-3 py-1 rounded-full text-sm font-semibold `}>
//                   {invoice.isPaid}
//                 </span>
//               </div>
//             )
//           })
//         ) : (
//           <p className="text-center text-gray-500">No payments found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentRequests;
