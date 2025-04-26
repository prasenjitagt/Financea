import { ClientType } from "@/app/clients/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ClientsPageCardPropType {
    title: string,
    description: string,
    totalClients: number,

}


export default function ClientsPageTotalClientsCards({ title, totalClients, description }: ClientsPageCardPropType) {
    return (
        <Card className="w-[273px]">
            <CardContent >
                <h4 className="text-xl font-normal text-muted-foreground mb-[12px]">
                    {title}
                </h4>
                <section className="flex justify-between mt-2">
                    <h3 className="md:text-3xl text-xl font-bold">{totalClients}</h3>
                    <p className=" text-muted-foreground text-[14px]">{description}</p>
                </section>
            </CardContent>
        </Card>
    )
}
