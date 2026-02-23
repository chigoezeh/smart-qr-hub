"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Smartphone, Monitor, Tablet } from "lucide-react";

interface DeviceData {
  type: string;
  count: number;
}

interface DeviceTypeChartProps {
  data: DeviceData[];
}

const COLORS: Record<string, string> = {
  Mobile: "#10b981",
  Desktop: "#3b82f6",
  Tablet: "#8b5cf6",
  Other: "#6b7280",
};

const ICONS: Record<string, any> = {
  Mobile: Smartphone,
  Desktop: Monitor,
  Tablet: Tablet,
  Other: Smartphone,
};

export function DeviceTypeChart({ data }: DeviceTypeChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Device Types</h3>
      
      {total === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No device data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="type" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px"
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.type] || "#6b7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 space-y-2">
            {data.map((item) => {
              const Icon = ICONS[item.type] || Smartphone;
              const percentage = ((item.count / total) * 100).toFixed(1);
              
              return (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: COLORS[item.type] }} />
                    <span className="text-sm text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
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
