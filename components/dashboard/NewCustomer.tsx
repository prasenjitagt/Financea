"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { clients_stats_route } from "@/lib/helpers/api-endpoints";

type ChartPoint = {
  name: string;
  value: number;
};



interface ApiResposeType {
  totalClients: number,
  totalServiceCharge: number,
  chartData: ChartPoint[]
}


const NewCustomer = () => {
  const [charData, setChartData] = useState<ChartPoint[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get<ApiResposeType>(clients_stats_route); // Replace with actual API URL

        setChartData(response.data.chartData);
        setTotal(response.data.totalClients)


      } catch (error) {
        console.log("Error fetching client stats", error);
        throw new Error("Error fetching client stats", error as ErrorOptions);
      }
    }

    fetchChartData();
  }, []);
  return (
    <div className="border rounded-lg shadow p-6 h-full">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-md font-medium">New Customer</h3>
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-100">
          Open
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{total}</div>
        <div className="h-[80px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charData}>
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {charData.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span>{charData[0].name}</span>
            <span>{charData[charData.length - 1].name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCustomer;
