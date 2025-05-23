
"use client";

import PaymentRequests from "@/components/dashboard/PayementRequests";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import FinancialAnalytics from "@/components/dashboard/FinancialAnalytics";
import NewCustomer from "@/components/dashboard/NewCustomer";
import ExpensesChart from "@/components/dashboard/ExpensesChart";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectGroup, SelectContent, SelectLabel } from "@/components/ui/select";
import { Archivo } from "next/font/google";
import { useState } from "react";

const archivo = Archivo({
  weight: "500",
  subsets: ["latin"],
});

export enum DashboardFrequency {
  Daily = "Daily",
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  Yearly = "Yearly"
}



const frequencyValues = {
  [DashboardFrequency.Daily]: "Daily",
  [DashboardFrequency.Monthly]: "Monthly",
  [DashboardFrequency.Quarterly]: "Quarterly",
  [DashboardFrequency.Yearly]: "Yearly"
};


const Dashboard = () => {

  const [frequency, setFrequency] = useState<DashboardFrequency>(DashboardFrequency.Quarterly);


  return (
    <div>
      {/* ✅ Financial Analytics Header */}
      <div className={`${archivo.className} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <h1 className="md:text-3xl text-2xl text-gray-800 dark:text-white md:py-1">Financial Analytics</h1>
        <Select
          value={frequency}
          onValueChange={(value) => setFrequency(value as DashboardFrequency)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Frquency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Frequencies</SelectLabel>
              {Object.entries(frequencyValues).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Analytics & Metrics Section */}
      <section className="mt-[22px] h-[440px] grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <div className=" col-span-1 lg:col-span-2">
          <FinancialAnalytics frequency={frequency} />
        </div>
        <div>
          <FinancialMetrics frequency={frequency} />
        </div>
      </section>

      {/* ✅ Your Overview Section */}
      <div className="mt-[22px]">
        <h2 className="md:text-3xl text-2xl text-gray-800 dark:text-white font-medium md:py-1">Your Overview</h2>
      </div>

      {/* ✅ Payment Requests, Recent Expenses, New Customers & Expenses Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <div className="flex flex-col w-full lg:col-span-1">
          <PaymentRequests />
        </div>
        <div className="flex flex-col w-full lg:col-span-1">
          <RecentExpenses />
        </div>
        {/* Flex-col setup for the Dashboard */}
        <div className="flex flex-col w-full gap-4 md:mt-6">
          <div className="flex flex-col w-full lg:col-span-1">
            <NewCustomer />
          </div>
          <div className="flex flex-col w-full lg:col-span-1">
            <ExpensesChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
