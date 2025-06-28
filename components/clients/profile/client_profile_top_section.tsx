import { FinanceaAuthOptions } from '@/app/api/auth/[...nextauth]/options'
import { sanitizeClient } from '@/app/clients/page'
import HeaderInfoCard from '@/components/profile/header-info-card'
import HeaderStats from '@/components/profile/header-stats'
import ProfileCard from '@/components/ProfileCard'
import { Card, CardContent } from '@/components/ui/card'
import connectDB from '@/lib/database/db_connection'
import { Client } from '@/lib/models/Clients.model'
import { ClientType, IndividualClientFromDataBaseType } from '@/lib/types'
import { getServerSession } from 'next-auth'
import React from 'react'

interface PropType {
    client_id: string
}

async function getClientData(clientId: string): Promise<ClientType | null> {
    try {
        await connectDB("app/clients/page.tsx");

        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");
            throw new Error("Unauthorized");
        }

        const client = await Client.findById(clientId)
            .lean<IndividualClientFromDataBaseType>();

        if (!client) {
            console.log("No Client Found");
            return null;
        }

        return sanitizeClient(client);
    } catch (error) {
        console.error("Error in fetching clients:", error);
        return null;
    }
}

async function getClientSpecificInvoices(client_id: string) {
    try {
        await connectDB("app/clients/page.tsx");

        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");
            throw new Error("Unauthorized");
        }


        const now = new Date();
        const currentMonthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthstartDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
        const prevMonthEndDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0, 23, 59, 59, 999);


    } catch (error) {

    }
}

export default async function ClientProfileTopSection({ client_id }: PropType) {

    const clientDetails = await getClientData(client_id);
    const clientName = clientDetails?.clientName != null ? clientDetails.clientName : "Loading...";
    const clientEmail = clientDetails?.email != null ? clientDetails.email : "Loading...";
    const clientPhone = clientDetails?.mobile != null ? clientDetails.mobile : "Loading...";



    return (
        <div className="w-full flex  items-center justify-between font-['Archivo'] text-[17px]">
            {/* Individual Client Details */}

            <ProfileCard
                name={clientName}
                email={clientEmail}
                phone={clientPhone}
            />



            {/* Invoice Details */}
            <section className=" grid grid-cols-1 lg:grid-cols-2 gap-4">

                <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                    <CardContent className="flex justify-between">

                        <HeaderInfoCard mainText={"Total Invoices"} count={`40`} />

                        <HeaderStats
                            percentageChange={23}
                            isIncreased={true}
                            bottomText={"from last month"}
                        />

                    </CardContent>
                </Card>

                <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                    <CardContent className="flex justify-between">

                        <HeaderInfoCard mainText={"Total Payment"} count={`$1200`} />

                        <HeaderStats
                            percentageChange={23}
                            isIncreased={true}
                            bottomText={"from last month"}
                        />

                    </CardContent>
                </Card>

                <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                    <CardContent className="flex justify-between">

                        <HeaderInfoCard mainText={"Outstanding Invoices"} count={`2`} />

                    </CardContent>
                </Card>

                <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                    <CardContent className="flex justify-between">

                        <HeaderInfoCard mainText={"Outstanding Payment"} count={`$1200`} />


                    </CardContent>
                </Card>

            </section>


        </div>
    )
}
