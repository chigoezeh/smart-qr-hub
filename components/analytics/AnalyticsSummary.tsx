"use client";

import { Eye, Users, Clock, TrendingUp, LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  color?: string;
}

function StatCard({ icon: Icon, label, value, change, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }[color];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend === "down" ? "rotate-180" : ""}`} />
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

interface AnalyticsSummaryProps {
  data: {
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    conversions: number;
    conversionRate: number;
  };
}

export default function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Eye}
        label="Total Views"
        value={data.totalViews.toLocaleString()}
        color="blue"
      />
      <StatCard
        icon={Users}
        label="Unique Visitors"
        value={data.uniqueVisitors.toLocaleString()}
        color="green"
      />
      <StatCard
        icon={Clock}
        label="Avg. Time on Page"
        value={formatTime(data.avgTimeOnPage)}
        color="purple"
      />
      <StatCard
        icon={TrendingUp}
        label="Conversion Rate"
        value={`${data.conversionRate}%`}
        color="orange"
      />
    </div>
  );
}
