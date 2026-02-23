import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { ScansOverTimeChart } from "@/components/analytics/ScansOverTimeChart";
import { OSBreakdownChart } from "@/components/analytics/OSBreakdownChart";
import { TopLocationsTable } from "@/components/analytics/TopLocationsTable";
import { ArrowLeft, QrCode, Calendar, MapPin, Smartphone } from "lucide-react";
import { format, subDays, parseISO } from "date-fns";

interface PageProps {
  params: Promise<{ qrCodeId: string }>;
  searchParams: Promise<{ range?: string }>;
}

export default async function AnalyticsPage({ params, searchParams }: PageProps) {
  const { qrCodeId } = await params;
  const { range = "30" } = await searchParams;
  
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    redirect("/onboarding");
  }

  // Fetch QR code and verify ownership
  const qrCode = await db.query.qrCodes.findFirst({
    where: and(
      eq(qrCodes.id, parseInt(qrCodeId)),
      eq(qrCodes.workspaceId, workspace.workspace.id)
    ),
  });

  if (!qrCode) {
    notFound();
  }

  // Calculate date range
  const daysBack = parseInt(range);
  const startDate = subDays(new Date(), daysBack);

  // Fetch scans within date range
  const scansData = await db.query.scans.findMany({
    where: and(
      eq(scans.qrCodeId, qrCode.id),
      gte(scans.scannedAt, startDate)
    ),
    orderBy: desc(scans.scannedAt),
  });

  // Process data for Scans Over Time chart
  const scansByDate = new Map<string, number>();
  scansData.forEach((scan) => {
    const date = format(scan.scannedAt, "yyyy-MM-dd");
    scansByDate.set(date, (scansByDate.get(date) || 0) + 1);
  });

  const scansOverTimeData = Array.from(scansByDate.entries())
    .map(([date, scans]) => ({ date, scans }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Process data for OS Breakdown chart
  const osCounts = new Map<string, number>();
  scansData.forEach((scan) => {
    const os = scan.os || "Other";
    osCounts.set(os, (osCounts.get(os) || 0) + 1);
  });

  const osBreakdownData = Array.from(osCounts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Process data for Top Locations table
  const locationCounts = new Map<string, { city: string; country: string; scans: number }>();
  scansData.forEach((scan) => {
    if (scan.city && scan.country) {
      const key = `${scan.city}, ${scan.country}`;
      const existing = locationCounts.get(key);
      if (existing) {
        existing.scans += 1;
      } else {
        locationCounts.set(key, {
          city: scan.city,
          country: scan.country,
          scans: 1,
        });
      }
    }
  });

  const topLocationsData = Array.from(locationCounts.values())
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 10);

  const totalScans = scansData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <QrCode className="w-8 h-8 text-blue-500" />
                {qrCode.title || "Untitled QR Code"}
              </h1>
              <p className="text-gray-600 mt-2">
                {qrCode.destinationUrl}
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
              {["7", "30", "90", "365"].map((days) => (
                <Link
                  key={days}
                  href={`/dashboard/analytics/${qrCodeId}?range=${days}`}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    range === days
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {days === "365" ? "1 Year" : `${days} Days`}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-gray-900">{totalScans}</p>
              </div>
              <Smartphone className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unique Locations</p>
                <p className="text-3xl font-bold text-gray-900">{locationCounts.size}</p>
              </div>
              <MapPin className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date Range</p>
                <p className="text-lg font-bold text-gray-900">{range} Days</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Daily Scans</p>
                <p className="text-3xl font-bold text-gray-900">
                  {daysBack > 0 ? Math.round(totalScans / daysBack) : 0}
                </p>
              </div>
              <QrCode className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ScansOverTimeChart data={scansOverTimeData} />
          </div>
          
          <OSBreakdownChart data={osBreakdownData} />
          
          <TopLocationsTable data={topLocationsData} totalScans={totalScans} />
        </div>
      </div>
    </div>
  );
}
