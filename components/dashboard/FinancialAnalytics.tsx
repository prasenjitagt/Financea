"use client"

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Archivo } from 'next/font/google';
import { DashboardFrequency } from '@/app/page';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

// Import Archivo font from Google Fonts
const archivo = Archivo({
    subsets: ['latin'],
});

type chartData = {
    month: string;
    revenue: number;
    expense: number;
}

const data: chartData[] = [
    { month: 'Jan', revenue: 4000, expense: 2400 },
    { month: 'Feb', revenue: 3000, expense: 1398 },
    { month: 'March', revenue: 5000, expense: 2000 },
    { month: 'April', revenue: 2780, expense: 3908 },
    { month: 'May', revenue: 1890, expense: 4800 },
    { month: 'June', revenue: 2390, expense: 3800 },
    { month: 'July', revenue: 3490, expense: 4300 },
];

interface FinancialAnalyticsProps {
    frequency: DashboardFrequency;
}

export default function FinancialAnalytics({ frequency }: FinancialAnalyticsProps) {
    return (
        <Card className="border border-[#e8e8e8]">
            <CardHeader>
                <CardTitle className={`${archivo.className} text-lg`}>Financial Analytics</CardTitle>
                <CardDescription>January - July 2024</CardDescription>
            </CardHeader>
            <CardContent className="h-[325px]">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            width={500}
                            height={400}
                            data={data}
                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        >
                            <defs>
                                {/* Gradient for Revenue */}
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0052CC" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0052CC" stopOpacity={0} />
                                </linearGradient>

                                {/* Gradient for Expense */}
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#172B4D" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#172B4D" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                padding={{ left: 30 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickCount={8}
                            />

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke='#e8e8e8'
                            />

                            <Tooltip />

                            {/* Revenue Area */}
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0052CC"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />

                            {/* Expense Area */}
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#172B4D"
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}   