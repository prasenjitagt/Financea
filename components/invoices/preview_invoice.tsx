import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import Image from "next/image";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Separator } from "../ui/separator";




export default function PreviewInvoice() {
    return (
        <div>
            <nav className="mb-8">
                <h2 className='text-2xl font-semibold text-center'>Preview Invoice</h2>
            </nav>




            <InvoiceBody />
        </div>
    )
}


const mockInvoiceData = [
    {
        name: "Site Building",
        quantity: 2,
        rate: "20",
    },
    {
        name: "Logo Design",
        quantity: 3,
        rate: "10",
    },
    {
        name: "Web Hosting (Annual)",
        quantity: 1,
        rate: "120",
    },
    {
        name: "SEO Optimization",
        quantity: 5,
        rate: "15",
    },
    {
        name: "Content Writing",
        quantity: 10,
        rate: "8",
    },
    {
        name: "Social Media Setup",
        quantity: 1,
        rate: "50",
    },
    {
        name: "E-commerce Integration",
        quantity: 1,
        rate: "75",
    },
    {
        name: "Maintenance (Monthly)",
        quantity: 6,
        rate: "30",
    },
    {
        name: "Graphic Design",
        quantity: 4,
        rate: "25",
    },
    {
        name: "Consultation Hours",
        quantity: 3,
        rate: "45",
    }
];

const totalDue = mockInvoiceData.reduce((sum, item) => (sum + (item.quantity * parseInt(item.rate))), 0);


function InvoiceBody() {
    return (
        <Card className="rounded-none border-x-0 border-y-[4px]  border-[#001342]">
            <CardHeader className="flex justify-between">
                <CardTitle className="text-2xl">Invoice</CardTitle>

                {/* User Logo */}
                <Image
                    src="/FinanceaLogo.png"
                    alt="Invoice Logo"
                    width={100}
                    height={100}
                />
            </CardHeader>

            <CardContent>
                {/* Invoice Number and Issue Date */}
                <section>
                    {/* Invoice Number */}
                    <div className="flex gap-1">
                        <p className="font-bold">Invoice Number:</p>
                        <p className="text-muted-foreground">{`#645877`}</p>
                    </div>


                    {/* Issue Date */}
                    <div className="flex gap-1">
                        <p className="font-bold">Date:</p>
                        <p className="text-muted-foreground">{`April 15, 2025`}</p>
                    </div>


                </section>

                <div className="h-16" />

                {/* Billed From and Billed To */}
                <section className="flex gap-32 ">
                    {/* Billed From*/}
                    <div >
                        <p className="font-bold">Billed From</p>
                        <p className="text-muted-foreground">{`Prasenjit Das`}</p>
                    </div>


                    {/* Billed To */}
                    <div >
                        <p className="font-bold">Billed To</p>
                        <p className="text-muted-foreground">{`Subhankar Sarkar`}</p>
                        <p className="text-muted-foreground">{`faltudimu@gmail.com`}</p>

                    </div>


                </section>

                <div className="h-16" />

                {/*Total Amount and Due Date  */}
                <h3 className="text-xl font-bold">{`$20.00 Due on April 21, 2025`}</h3>

                <div className="h-5" />


                {/* Item Details */}
                <Table className="w-full text-sm">
                    <TableHeader className=" border-b-2 border-slate-600">
                        <TableRow  >
                            <TableHead className="font-bold" >Description</TableHead>
                            <TableHead className="font-bold">Quantity</TableHead>
                            <TableHead className="font-bold">Rate</TableHead>
                            <TableHead className="font-bold">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                        {
                            mockInvoiceData.map((item, index) => {

                                const totalAmount = item.quantity * parseInt(item.rate);

                                return (
                                    <TableRow className="text-muted-foreground" key={index}>
                                        <TableCell >{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{`$${item.rate}`}</TableCell>
                                        <TableCell>{`$${totalAmount}`}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </tbody>
                </Table>

            </CardContent>

            <CardFooter className="flex justify-end">
                <section>
                    <Separator />
                    <div className="mt-3 flex gap-20 items-center  font-semibold">

                        <p >Amount Due:</p>
                        <p >{`$${totalDue}`}</p>
                    </div>
                </section>
            </CardFooter>
        </Card>
    )
}




