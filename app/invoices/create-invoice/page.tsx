"use client";

import { GoX } from "react-icons/go";
import { useRouter } from "next/navigation";
import { Archivo } from "next/font/google";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CreateInvoiceForm from "@/components/invoices/create_invoice_form";
import PreviewInvoice from "@/components/invoices/preview_invoice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceZodSchema, createInvoiceFormType } from "@/lib/zod/create_invoice_zod_schema";

const archivo = Archivo({
  weight: "500",
  subsets: ["latin"],
});

const InvoiceCreatorPage = () => {
  const router = useRouter();

  const form = useForm<createInvoiceFormType>({
    resolver: zodResolver(createInvoiceZodSchema),
    defaultValues: {
      invoiceNumber: "",
      issueDate: new Date(),
      dueDate: undefined,
      clientId: "",
      clientEmail: "",
      isRecurring: false,
      recurringFrequency: "Monthly",
      recurringIssueDate: new Date(),
      recurringDueDate: undefined,
      currency: "INR",
      items: [
        {
          ishourly: false,
          name: "",
          quantity: 0,
          rate: 0,
        },
      ],
      discountPercent: 0,
      taxPercent: 0,
      note: "",
      terms: "",
      subTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
    },
  });

  return (
    <div className={`${archivo.className} w-full`}>
      {/* Top navigation */}
      <nav className="sticky top-0 z-50 border-2 flex lg:h-[70px] py-[11px] px-[20px] rounded-t-lg items-center gap-3 bg-white">
        <GoX className="cursor-pointer" onClick={() => router.back()} size={24} />
        <div className="w-px h-6 bg-[#B5B5B5]" />
        <CardTitle className="text-[17px]">Create Invoice</CardTitle>
      </nav>

      {/* Form and Preview */}
      <section className="flex flex-col lg:flex-row justify-between">
        {/* Invoice Form */}
        <Card className="w-full lg:w-7/12 bg-white p-6 rounded-none">
          <CardContent>
            <CreateInvoiceForm form={form} />
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="w-full lg:w-5/12 bg-[#F7F6F6] p-6 rounded-none">
          <CardContent>
            <PreviewInvoice formData={form.watch()} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default InvoiceCreatorPage;
