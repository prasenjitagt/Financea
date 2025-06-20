"use client";
import { ClientType } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface ClientsPageCardPropType {
    title: string,
    description: string,
    clients: ClientType[]
}


export default function ClientsPageTotalPaymentsCards({ title, clients, description }: ClientsPageCardPropType) {
    const totalINRServiceCharge = clients.reduce((sum, client) => sum + client.serviceCharge, 0);
    const currency = useSelector((state: RootState) => state.currencyInfo.currency);
    const currencySymbol = currency === "INR" ? "₹" : "$";

    return (
        <Card className="w-[273px]">
            <CardContent >
                <h4 className="text-xl font-normal  text-muted-foreground mb-[12px] ">
                    {title}
                </h4>
                <section className="flex justify-between mt-2">
                    <h3 className="md:text-3xl text-xl font-bold">{`${currencySymbol}${totalINRServiceCharge}`}</h3>
                    <p className="whitespace-pre-line text-muted-foreground text-[14px]">{description.replace(/ /g, '\n')}</p>
                </section>
            </CardContent>
        </Card>
    )
}
