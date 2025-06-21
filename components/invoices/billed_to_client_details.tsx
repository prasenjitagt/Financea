"use client";

import { getTelephoneCode } from "@/lib/helpers/create_invoice/getTelephoneCode";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Client } from "./create_invoice_form";

interface PropType {
  selectedClientDetails: Client | null;
}

export default function BilledToClientDetails({
  selectedClientDetails,
}: PropType) {
  if (selectedClientDetails === null) {
    return (
      <Card className="w-full lg:h-[155px] rounded-[16px] px-[18px] py-[10px] bg-[#FBFCFE]">
        <CardTitle className="text-[#000000] font-medium text-[16px]">
          Billed To
        </CardTitle>
        <CardContent className="flex justify-center items-center">
          <h5 className="scroll-m-20 text-base font-normal  text-gray-400 tracking-tight">
            No Clients Selected !
          </h5>
        </CardContent>
      </Card>
    );
  }

  const {
    clientName,
    companyName,
    email,
    mobile,
    address,
    state,
    country,
    postal,
  } = selectedClientDetails;

  const countryTelephoneCode = getTelephoneCode(country);

  return (
    <Card className="w-full rounded-[16px] shadow-sm py-[10px] bg-[#FBFCFE]">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-[#000000] text-[16px]">
          <h3 className="scroll-m-20  text-base font-medium tracking-tight">
            Billed To
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <h5 className="scroll-m-20 text-base tracking-tight mr-[10px]">
            {clientName}
          </h5>

          <h5 className="text-[#737982] scroll-m-20 text-base tracking-tight">
            {`From: ${companyName}`}
          </h5>
        </div>

        <blockquote className="mt-2 font-light text-[#363C45]">
          {`${address},${state},${country}-${postal}`}
        </blockquote>

        <div className="flex text-base font-light leading-7 [&:not(:first-child)]:mt">
          <p className="text-[#737982] mr-[10px]">Email</p>

          <p>{email}</p>
        </div>

        <div className="flex text-base font-light leading-7 ">
          <p className="text-[#737982] mr-[10px]">Phone</p>

          <p className="mr-[5px]">{countryTelephoneCode}</p>

          <p>{mobile}</p>
        </div>
      </CardContent>
    </Card>
  );
}
