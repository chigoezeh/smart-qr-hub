import { db } from "../../db";
import { qrCodes, scans } from "../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import StatCard from "@/components/StatCard";
import TypeDistribution from "@/components/TypeDistribution";
import RecentActivity from "@/components/RecentActivity";
import { Plus, LayoutGrid, ArrowRight, Settings } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Get current user's workspace
  const { workspace } = await getCurrentWorkspace();

  // Fetch all codes for this workspace
  const analyticsData = await db
    .select({
      id: qrCodes.id,
      title: qrCodes.title,
      shortCode: qrCodes.shortCode,
      destinationUrl: qrCodes.destinationUrl,
      contentType: qrCodes.contentType,
      contentData: qrCodes.contentData,
      createdAt: qrCodes.createdAt,
      status: qrCodes.status,
      scanCount: sql<number>`count(${scans.id})`.mapWith(Number),
      isPasswordProtected: qrCodes.isPasswordProtected,
      expiresAt: qrCodes.expiresAt,
      maxScans: qrCodes.maxScans,
      currentScans: qrCodes.currentScans,
      geofence: sql<string | null>`${qrCodes.geofence}::text`,
    })
    .from(qrCodes)
    .leftJoin(scans, eq(qrCodes.id, scans.qrCodeId))
    .where(eq(qrCodes.workspaceId, workspace.id))
    .groupBy(qrCodes.id)
    .orderBy(desc(qrCodes.createdAt));

  // Calculate stats
  const totalQRCodes = analyticsData.length;
  const totalScans = analyticsData.reduce((sum, row) => sum + row.scanCount, 0);
  const activeCodes = analyticsData.filter((row) => row.status === "active").length;
  const securedCodes = analyticsData.filter((row) => 
    row.isPasswordProtected || row.expiresAt !== null || row.maxScans !== null || row.geofence !== null
  ).length;
  
  // Calculate type distribution
  const typeDistribution = analyticsData.reduce((acc, row) => {
    const type = row.contentType || "url";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopularType = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0];
  const uniqueTypes = Object.keys(typeDistribution).length;

  // Fetch recent scans for activity feed
  const recentScans = await db
    .select({
      id: scans.id,
      qrCodeTitle: qrCodes.title,
      qrCodeShortCode: qrCodes.shortCode,
      scannedAt: scans.scannedAt,
      country: scans.country,
      city: scans.city,
      os: scans.os,
      deviceType: scans.deviceType,
    })
    .from(scans)
    .innerJoin(qrCodes, eq(scans.qrCodeId, qrCodes.id))
    .where(eq(qrCodes.workspaceId, workspace.id))
    .orderBy(desc(scans.scannedAt))
    .limit(10);

  return (
    <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatCard title="Total QR Codes" value={totalQRCodes} icon="qr" color="blue" />
          <StatCard title="Total Scans" value={totalScans.toLocaleString()} icon="scans" color="green" />
          <StatCard title="Active Codes" value={activeCodes} icon="active" color="purple" />
          <StatCard title="Secured QRs" value={securedCodes} icon="lock" color="red" />
          <StatCard 
            title="Content Types" 
            value={uniqueTypes} 
            icon="qr" 
            color="indigo"
            subtitle={mostPopularType ? `${mostPopularType[0]} (${mostPopularType[1]})` : undefined}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/create"
            className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Create New QR Code</h3>
            <p className="text-sm text-gray-600">
              Generate a new smart QR code with 12 content types to choose from
            </p>
          </Link>

          <Link
            href="/dashboard/qr-codes"
            className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage QR Codes</h3>
            <p className="text-sm text-gray-600">
              View, edit, and analyze all your QR codes in one place
            </p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">API Settings</h3>
            <p className="text-sm text-gray-600">
              Manage API keys and webhook configurations for integrations
            </p>
          </Link>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Type Distribution */}
          {analyticsData.length > 0 && (
            <TypeDistribution data={analyticsData} />
          )}

          {/* Recent Activity */}
          <RecentActivity scans={recentScans} />
        </div>
      </div>
  );
}