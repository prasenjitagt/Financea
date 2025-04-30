"use client";

import { GoX } from "react-icons/go";
import { useRouter } from "next/navigation";
import { Archivo } from "next/font/google";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CreateInvoiceForm from "@/components/invoices/create_invoice_form";
import PreviewInvoice from "@/components/invoices/preview_invoice";

const archivo = Archivo({
  weight: "500",
  subsets: ["latin"],
});








const InvoiceCreatorPage = () => {
  const router = useRouter();

  return (
    <div className={`${archivo.className} w-full`}>

      <nav className="sticky top-0 z-50 border-2 flex lg:h-[70px] py-[11px] px-[20px] rounded-t-lg items-center gap-3 bg-white">

        <GoX className="cursor-pointer" onClick={() => router.back()} size={24} />
        <div className="w-px h-6 bg-[#B5B5B5]" />
        <CardTitle className="text-[17px]">Create Invoice</CardTitle>

      </nav>

      {/* Create Invoice Form and Preview */}
      <section className="flex justify-between">

        {/* Create Invoice Form */}
        <Card className="w-full lg:w-7/12 bg-white p-6 rounded-none  ">
          <CardContent>
            <CreateInvoiceForm />
          </CardContent>
        </Card>


        {/* Invoice Preview */}
        <Card className="w-full lg:w-5/12 bg-[#F7F6F6] p-6 rounded-none  ">
          <CardContent>
            <PreviewInvoice />
          </CardContent>
        </Card>

      </section>
    </div>
  );
};

export default InvoiceCreatorPage;
