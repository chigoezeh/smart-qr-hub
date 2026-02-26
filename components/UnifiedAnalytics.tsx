"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MousePointer, QrCode, FileText } from "lucide-react";

interface UnifiedAnalyticsProps {
  pageId: number;
  pageSlug: string;
}

interface AnalyticsData {
  qrScans: number;
  pageViews: number;
  totalConversions: number;
  linkedQRCodes: number;
  qrScansBySource: Array<{ source: string; scans: number }>;
  viewsOverTime: Array<{ date: string; qrScans: number; directViews: number }>;
}

export default function UnifiedAnalytics({ pageId, pageSlug }: UnifiedAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/analytics/unified?pageId=${pageId}&timeRange=${timeRange}`
      );
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  const totalTraffic = data.qrScans + data.pageViews;
  const qrPercentage = totalTraffic > 0 ? Math.round((data.qrScans / totalTraffic) * 100) : 0;
  const directPercentage = 100 - qrPercentage;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end gap-2">
        {[
          { value: "7d" as const, label: "7 Days" },
          { value: "30d" as const, label: "30 Days" },
          { value: "90d" as const, label: "90 Days" },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <QrCode className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.qrScans.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">QR Code Scans</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.pageViews.toLocaleString()}</div>
          <div className="text-purple-100 text-sm">Direct Page Views</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalTraffic.toLocaleString()}</div>
          <div className="text-green-100 text-sm">Total Traffic</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <MousePointer className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.totalConversions.toLocaleString()}</div>
          <div className="text-orange-100 text-sm">Conversions</div>
        </div>
      </div>

      {/* Traffic Source Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Source Breakdown</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">QR Code Scans</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {data.qrScans.toLocaleString()} ({qrPercentage}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${qrPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Direct Page Views</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {data.pageViews.toLocaleString()} ({directPercentage}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${directPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Sources */}
      {data.qrScansBySource.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Sources</h3>
          <div className="space-y-3">
            {data.qrScansBySource.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{source.source || "Unknown"}</span>
                <span className="text-sm font-semibold text-indigo-600">
                  {source.scans.toLocaleString()} scans
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked QR Codes Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <QrCode className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="font-medium text-indigo-900">
              {data.linkedQRCodes} QR Code{data.linkedQRCodes !== 1 ? "s" : ""} Linked
            </p>
            <p className="text-sm text-indigo-700">
              QR codes directing traffic to /{pageSlug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
