"use client";

import { MapPin } from "lucide-react";

interface LocationData {
  city: string;
  country: string;
  scans: number;
}

interface TopLocationsTableProps {
  data: LocationData[];
  totalScans: number;
}

export function TopLocationsTable({ data, totalScans }: TopLocationsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" />
        Top Locations
      </h3>
      
      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No location data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">City</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Country</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Scans</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((location, index) => {
                const percentage = ((location.scans / totalScans) * 100).toFixed(1);
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">{location.city || "Unknown"}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{location.country || "Unknown"}</td>
                    <td className="py-3 px-2 text-sm text-right font-semibold text-gray-900">{location.scans}</td>
                    <td className="py-3 px-2 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-600 w-12">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
