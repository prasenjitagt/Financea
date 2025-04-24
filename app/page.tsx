
"use client";

import { useState, useEffect } from "react";
import PaymentRequests from "@/components/dashboard/PayementRequests";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import FinancialAnalytics from "@/components/dashboard/FinancialAnalytics";
import NewCustomer from "@/components/dashboard/NewCustomer";
import ExpensesChart from "@/components/dashboard/ExpensesChart";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectGroup, SelectContent, SelectLabel } from "@/components/ui/select";
import { Archivo } from "next/font/google";

const archivo = Archivo({
  weight: "500",
  subsets: ["latin"],
});

const frquencyValues = {
  Quarterly: "Quarterly",
  Monthly: "Monthly",
  Yearly: "Yearly",
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <div>
      {/* ✅ Financial Analytics Header */}
      <div className={`${archivo.className} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <h1 className="md:text-3xl text-2xl text-gray-800 md:py-1">Financial Analytics</h1>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Quarterly" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Frequency</SelectLabel>
              <SelectItem value={frquencyValues.Monthly}>{frquencyValues.Monthly}</SelectItem>
              <SelectItem value={frquencyValues.Quarterly}>{frquencyValues.Quarterly}</SelectItem>
              <SelectItem value={frquencyValues.Yearly}>{frquencyValues.Yearly}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Analytics & Metrics Section */}
      <div className="mt-[22px] grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <div className="col-span-1 lg:col-span-2">
          <FinancialAnalytics />
        </div>
        <div>
          <FinancialMetrics />
        </div>
      </div>

      {/* ✅ Your Overview Section */}
      <div className="mt-[22px]">
        <h2 className="md:text-3xl text-2xl text-gray-800 font-medium md:py-1">Your Overview</h2>
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
