"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Smartphone, Monitor, TabletSmartphone } from "lucide-react";

interface OSData {
  name: string;
  value: number;
}

interface OSBreakdownChartProps {
  data: OSData[];
}

const COLORS: Record<string, string> = {
  iOS: "#3b82f6",
  Android: "#10b981",
  Desktop: "#8b5cf6",
  Other: "#6b7280",
};

const ICONS: Record<string, any> = {
  iOS: Smartphone,
  Android: Smartphone,
  Desktop: Monitor,
  Other: TabletSmartphone,
};

export function OSBreakdownChart({ data }: OSBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Device & OS Breakdown</h3>
      
      {total === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No scan data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#6b7280"} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-6 space-y-2">
            {data.map((item) => {
              const Icon = ICONS[item.name] || TabletSmartphone;
              const percentage = ((item.value / total) * 100).toFixed(1);
              
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: COLORS[item.name] }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
