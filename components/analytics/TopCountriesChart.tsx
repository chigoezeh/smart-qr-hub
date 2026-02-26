"use client";

import { Globe } from "lucide-react";

interface TopCountriesProps {
  data: Array<{ country: string; count: number }>;
}

export default function TopCountriesChart({ data }: TopCountriesProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No location data available</p>
      </div>
    );
  }

  const countryFlags: Record<string, string> = {
    US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦", AU: "🇦🇺", DE: "🇩🇪",
    FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸", NL: "🇳🇱", JP: "🇯🇵",
    CN: "🇨🇳", IN: "🇮🇳", BR: "🇧🇷", MX: "🇲🇽", RU: "🇷🇺",
    NG: "🇳🇬", ZA: "🇿🇦", EG: "🇪🇬", KE: "🇰🇪", GH: "🇬🇭",
    Unknown: "🌍",
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        Top Countries
      </h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              const flag = countryFlags[item.country] || "🌍";
              
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{flag}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.country === "Unknown" ? "Unknown" : item.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
