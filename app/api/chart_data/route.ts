
import { NextResponse } from 'next/server';
import { DashboardFrequency } from '@/app/page';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const frequency = searchParams.get('frequency') as DashboardFrequency;

    try {
        // Generate mock data based on frequency
        const data = generateMockData(frequency);

        return NextResponse.json({
            success: true,
            data
        }, { status: 200 });

    } catch (error) {
        console.error("Error genarting chart data:", error);

        return NextResponse.json({
            success: false,
            error: 'Failed to generate data'
        }, { status: 500 });
    }
}

function generateMockData(frequency: DashboardFrequency) {
    const now = new Date();
    const dataPoints = getDataPointCount(frequency);
    const data = [];

    for (let i = dataPoints; i >= 0; i--) {
        const date = new Date();
        let period = '';
        let revenue = 0;
        let expense = 0;

        // Adjust date based on frequency
        switch (frequency) {
            case DashboardFrequency.Daily:
                date.setDate(now.getDate() - i);
                period = date.toISOString();
                revenue = 3000 + Math.random() * 5000;
                expense = 1000 + Math.random() * 4000;
                break;

            case DashboardFrequency.Monthly:
                date.setMonth(now.getMonth() - i);
                period = date.toISOString();
                revenue = 10000 + Math.random() * 20000;
                expense = 5000 + Math.random() * 15000;
                break;

            case DashboardFrequency.Quarterly:
                date.setMonth(now.getMonth() - (i * 3));
                period = date.toISOString();
                revenue = 30000 + Math.random() * 60000;
                expense = 15000 + Math.random() * 45000;
                break;

            case DashboardFrequency.Yearly:
                date.setFullYear(now.getFullYear() - i);
                period = date.toISOString();
                revenue = 120000 + Math.random() * 240000;
                expense = 60000 + Math.random() * 180000;
                break;
        }

        // Add some realistic fluctuations
        if (i % 2 === 0) {
            revenue *= 0.9; // 10% decrease for even periods
            expense *= 1.1; // 10% increase for even periods
        } else {
            revenue *= 1.1; // 10% increase for odd periods
            expense *= 0.9; // 10% decrease for odd periods
        }

        data.push({
            period,
            revenue: Math.round(revenue),
            expense: Math.round(expense)
        });
    }

    // Sort by date ascending
    return data.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
}

function getDataPointCount(frequency: DashboardFrequency): number {
    switch (frequency) {
        case DashboardFrequency.Daily: return 30; // Last 30 days
        case DashboardFrequency.Monthly: return 12; // Last 12 months
        case DashboardFrequency.Quarterly: return 8; // Last 8 quarters (2 years)
        case DashboardFrequency.Yearly: return 5; // Last 5 years
        default: return 12;
    }
}