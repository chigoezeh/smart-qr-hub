"use client";

import { Download } from "lucide-react";
import { useState } from "react";

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
}

interface ExportLandingPageCSVProps {
  data: AnalyticsData;
  pageTitle: string;
  slug: string;
}

export default function ExportLandingPageCSV({ data, pageTitle, slug }: ExportLandingPageCSVProps) {
  const [exporting, setExporting] = useState(false);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const generateCSV = () => {
    const lines: string[] = [];
    const date = new Date().toISOString().split("T")[0];

    // Header
    lines.push(`Analytics Export - ${pageTitle} (/${slug})`);
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");

    // Summary Metrics
    lines.push("SUMMARY METRICS");
    lines.push("Metric,Value");
    lines.push(`Total Views,${data.summary.totalViews}`);
    lines.push(`Unique Visitors,${data.summary.uniqueVisitors}`);
    lines.push(`Average Time on Page,${formatTime(data.summary.avgTimeOnPage)}`);
    lines.push(`Conversions,${data.summary.conversions}`);
    lines.push(`Conversion Rate,${data.summary.conversionRate}%`);
    lines.push("");

    // Views Timeline
    lines.push("DAILY VIEWS");
    lines.push("Date,Views");
    data.viewsTimeline.forEach(item => {
      lines.push(`${item.date},${item.views}`);
    });
    lines.push("");

    // Device Breakdown
    lines.push("DEVICE BREAKDOWN");
    lines.push("Device,Count,Percentage");
    const totalDevices = Object.values(data.deviceBreakdown).reduce((sum, count) => sum + count, 0);
    Object.entries(data.deviceBreakdown).forEach(([device, count]) => {
      const percentage = totalDevices > 0 ? ((count / totalDevices) * 100).toFixed(1) : 0;
      lines.push(`${device},${count},${percentage}%`);
    });
    lines.push("");

    // OS Breakdown
    lines.push("OPERATING SYSTEM BREAKDOWN");
    lines.push("OS,Count,Percentage");
    const totalOS = Object.values(data.osBreakdown).reduce((sum, count) => sum + count, 0);
    Object.entries(data.osBreakdown).forEach(([os, count]) => {
      const percentage = totalOS > 0 ? ((count / totalOS) * 100).toFixed(1) : 0;
      lines.push(`${os},${count},${percentage}%`);
    });
    lines.push("");

    // Top Countries
    if (data.topCountries.length > 0) {
      lines.push("TOP COUNTRIES");
      lines.push("Country,Views,Percentage");
      const totalCountryViews = data.topCountries.reduce((sum, item) => sum + item.count, 0);
      data.topCountries.forEach(item => {
        const percentage = totalCountryViews > 0 ? ((item.count / totalCountryViews) * 100).toFixed(1) : 0;
        lines.push(`${item.country},${item.count},${percentage}%`);
      });
      lines.push("");
    }

    // Top Referrers
    if (data.topReferrers.length > 0) {
      lines.push("TOP REFERRERS");
      lines.push("Source,Views");
      data.topReferrers.forEach(item => {
        // Escape commas in URLs
        const source = item.referrer.includes(",") ? `"${item.referrer}"` : item.referrer;
        lines.push(`${source},${item.count}`);
      });
      lines.push("");
    }

    // Top Blocks
    if (data.topBlocks.length > 0) {
      lines.push("MOST VIEWED BLOCKS");
      lines.push("Block Title,Type,Views");
      data.topBlocks.forEach(block => {
        const title = block.title || "Untitled Block";
        const escapedTitle = title.includes(",") ? `"${title}"` : title;
        lines.push(`${escapedTitle},${block.blockType},${block.views}`);
      });
      lines.push("");
    }

    return lines.join("\n");
  };

  const handleExport = () => {
    setExporting(true);
    
    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics-${slug}-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export analytics data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      {exporting ? "Exporting..." : "Export Data"}
    </button>
  );
}
