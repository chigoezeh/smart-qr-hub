"use client";

import { QRContentType, QR_TYPE_METADATA } from "@/types/qr-content";
import * as LucideIcons from "lucide-react";
import { useMemo } from "react";

interface TypeDistributionProps {
  data: Array<{ contentType: string }>;
}

export default function TypeDistribution({ data }: TypeDistributionProps) {
  const distribution = useMemo(() => {
    const counts = data.reduce((acc, item) => {
      const type = item.contentType || "url";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = data.length;
    
    return Object.entries(counts)
      .map(([type, count]) => ({
        type: type as QRContentType,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Type Distribution</h3>
        <p className="text-gray-500 text-sm">No data available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Content Type Distribution
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Distribution of {data.length} QR codes across {distribution.length} types
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        {distribution.map(({ type, count, percentage }) => {
          const metadata = QR_TYPE_METADATA[type];
          const IconComponent = (LucideIcons as any)[metadata.icon] || LucideIcons.QrCode;
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${metadata.color}20, ${metadata.color}30)`,
                      border: `1.5px solid ${metadata.color}40`,
                    }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: metadata.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize text-sm">{type}</p>
                    <p className="text-xs text-gray-500">{metadata.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${metadata.color}, ${metadata.color}dd)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary footer */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <span className="font-bold text-gray-900">{distribution[0]?.type || "None"}</span> is most popular
          </span>
          <span className="text-gray-600">
            {distribution.length} unique {distribution.length === 1 ? "type" : "types"}
          </span>
        </div>
      </div>
    </div>
  );
}
