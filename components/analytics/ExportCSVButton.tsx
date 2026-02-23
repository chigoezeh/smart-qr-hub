"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface ScanData {
  id: number;
  scannedAt: Date;
  os: string | null;
  deviceType: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

interface ExportCSVButtonProps {
  scans: ScanData[];
  qrCodeTitle: string;
  shortCode: string;
}

export function ExportCSVButton({ scans, qrCodeTitle, shortCode }: ExportCSVButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      // Define CSV headers
      const headers = [
        "Scan ID",
        "Scanned At",
        "Date",
        "Time",
        "Operating System",
        "Device Type",
        "Country",
        "City",
        "Latitude",
        "Longitude",
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "Referrer",
        "User Agent"
      ];

      // Convert scans to CSV rows
      const rows = scans.map((scan) => [
        scan.id,
        format(new Date(scan.scannedAt), "yyyy-MM-dd HH:mm:ss"),
        format(new Date(scan.scannedAt), "yyyy-MM-dd"),
        format(new Date(scan.scannedAt), "HH:mm:ss"),
        scan.os || "Unknown",
        scan.deviceType || "Unknown",
        scan.country || "Unknown",
        scan.city || "Unknown",
        scan.latitude?.toString() || "",
        scan.longitude?.toString() || "",
        scan.utmSource || "",
        scan.utmMedium || "",
        scan.utmCampaign || "",
        scan.referrer || "",
        `"${(scan.userAgent || "").replace(/"/g, '""')}"` // Escape quotes in user agent
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const timestamp = format(new Date(), "yyyy-MM-dd");
      const filename = `qr-analytics-${shortCode}-${timestamp}.csv`;
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (scans.length === 0) {
    return null;
  }

  return (
    <button
      onClick={exportToCSV}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      <Download className="w-4 h-4" />
      {isExporting ? "Exporting..." : `Export CSV (${scans.length} scans)`}
    </button>
  );
}
