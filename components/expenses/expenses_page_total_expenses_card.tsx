import { Card, CardContent } from "../ui/card";

interface ExpensesPageCardPropType {
    title: string,
    description: string,
    totalExpenses: number,

}


export default function ExpensesPageTotalExpensesCards({ title, totalExpenses, description }: ExpensesPageCardPropType) {
    return (
        <Card className="w-[273px]">
            <CardContent >
                <h4 className="text-xl font-normal text-muted-foreground mb-[12px]">
                    {title}
                </h4>
                <section className="flex justify-between mt-2">
                    <h3 className="md:text-3xl text-xl font-bold">{totalExpenses}</h3>
                    <p className=" text-muted-foreground text-[14px]">{description}</p>
                </section>
            </CardContent>
        </Card>
    )
}
