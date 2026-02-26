"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DateRangeSelector from "./DateRangeSelector";
import AnalyticsSummary from "./AnalyticsSummary";
import ViewsOverTimeChart from "./ViewsOverTimeChart";
import DeviceBreakdownChart from "./DeviceBreakdownChart";
import TopCountriesChart from "./TopCountriesChart";
import ExportLandingPageCSV from "./ExportLandingPageCSV";
import { RefreshCw } from "lucide-react";

interface AnalyticsData {
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    conversions: number;
    conversionRate: number;
  };
  viewsTimeline: Array<{ date: string; views: number }>;
  deviceBreakdown: Record<string, number>;
  osBreakdown: Record<string, number>;
  topCountries: Array<{ country: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  topBlocks: Array<{ id: number; blockType: string; title: string | null; views: number }>;
  utmCampaigns?: Array<{
    campaign: string;
    views: number;
    conversions: number;
    conversionRate: number;
    sources: string[];
  }>;
}

interface AnalyticsDashboardProps {
  pageId: number;
  pageTitle: string;
  slug: string;
  initialData: AnalyticsData;
  initialDays: number;
}

export default function AnalyticsDashboard({
  pageId,
  pageTitle,
  slug,
  initialData,
  initialDays,
}: AnalyticsDashboardProps) {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [days, setDays] = useState(initialDays);
  const [customStart, setCustomStart] = useState<string>();
  const [customEnd, setCustomEnd] = useState<string>();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Real-time polling
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      await fetchAnalytics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, days, customStart, customEnd]);

  const fetchAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const params = new URLSearchParams({ days: days.toString() });
      if (customStart) params.set("start", customStart);
      if (customEnd) params.set("end", customEnd);

      const response = await fetch(`/api/analytics/page/${pageId}?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRangeChange = (newDays: number, start?: string, end?: string) => {
    setDays(newDays);
    setCustomStart(start);
    setCustomEnd(end);
    
    // Update URL and refresh data
    const params = new URLSearchParams({ days: newDays.toString() });
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    
    router.push(`?${params}`, { scroll: false });
    fetchAnalytics();
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <DateRangeSelector
          selectedRange={days}
          customStart={customStart}
          customEnd={customEnd}
          onRangeChange={handleRangeChange}
        />

        <div className="flex items-center gap-3">
          {/* Auto-refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              autoRefresh
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={fetchAnalytics}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <span className="text-xs text-gray-500">
            Last updated: {formatLastRefresh()}
          </span>

          {/* Export Button */}
          <ExportLandingPageCSV
            data={data}
            pageTitle={pageTitle}
            slug={slug}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummary data={data.summary} />

      {/* Views Over Time Chart */}
      <ViewsOverTimeChart data={data.viewsTimeline} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Breakdown */}
        <DeviceBreakdownChart data={data.deviceBreakdown} />

        {/* OS Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
          <div className="space-y-3">
            {Object.entries(data.osBreakdown).map(([os, count]) => {
              const total = Object.values(data.osBreakdown).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              return (
                <div key={os}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{os}</span>
                    <span className="text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <TopCountriesChart data={data.topCountries} />

      {/* Top Referrers */}
      {data.topReferrers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topReferrers.map((ref, idx) => {
                  const total = data.topReferrers.reduce((sum, r) => sum + r.count, 0);
                  const percentage = ((ref.count / total) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {ref.referrer || "Direct"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {ref.count}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Most Viewed Blocks */}
      {data.topBlocks.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Blocks</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Block
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topBlocks.map((block) => (
                  <tr key={block.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {block.title || "Untitled Block"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {block.blockType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {block.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
