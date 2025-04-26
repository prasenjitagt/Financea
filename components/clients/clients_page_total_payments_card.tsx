import { ClientType } from "@/app/clients/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ClientsPageCardPropType {
    title: string,
    description: string,
    totalPayments: number,
    clients: ClientType[]
}


export default function ClientsPageTotalPaymentsCards({ title, totalPayments, description, clients }: ClientsPageCardPropType) {
    return (
        <Card className="w-[273px]">
            <CardContent >
                <h4 className="text-xl font-normal  text-muted-foreground mb-[12px] ">
                    {title}
                </h4>
                <section className="flex justify-between mt-2">
                    <h3 className="md:text-3xl text-xl font-bold">{`$${totalPayments}`}</h3>
                    <p className="whitespace-pre-line text-muted-foreground text-[14px]">{description.replace(/ /g, '\n')}</p>
                </section>
            </CardContent>
        </Card>
    )
}
