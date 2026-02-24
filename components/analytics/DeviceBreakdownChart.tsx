"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";

interface DeviceChartProps {
  data: Record<string, number>;
}

export default function DeviceBreakdownChart({ data }: DeviceChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No device data available</p>
      </div>
    );
  }

  const devices = [
    { key: "desktop", label: "Desktop", icon: Monitor, color: "bg-blue-500" },
    { key: "mobile", label: "Mobile", icon: Smartphone, color: "bg-green-500" },
    { key: "tablet", label: "Tablet", icon: Tablet, color: "bg-purple-500" },
    { key: "unknown", label: "Unknown", icon: Monitor, color: "bg-gray-400" },
  ];

  const deviceStats = devices
    .map(device => ({
      ...device,
      count: data[device.key] || 0,
      percentage: total > 0 ? ((data[device.key] || 0) / total) * 100 : 0,
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="space-y-4">
          {deviceStats.map((device) => {
            const Icon = device.icon;
            return (
              <div key={device.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{device.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{device.count} views</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(device.percentage)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${device.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Total Devices: <span className="font-semibold text-gray-900">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
