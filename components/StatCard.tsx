"use client";

import { QrCode, MousePointerClick, TrendingUp, CheckCircle2 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: "qr" | "scans" | "active" | "trending";
  color: "blue" | "green" | "purple" | "orange";
}

const iconMap = {
  qr: QrCode,
  scans: MousePointerClick,
  active: CheckCircle2,
  trending: TrendingUp,
};

const colorMap = {
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  green: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-600",
    gradient: "from-green-500 to-green-600",
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  orange: {
    bg: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
  },
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const Icon = iconMap[icon];
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-14 h-14 ${colors.light} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
}
