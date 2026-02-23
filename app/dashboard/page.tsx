import { db } from "../../db";
import { qrCodes, scans } from "../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { UserButton } from "@clerk/nextjs";
import StatCard from "@/components/StatCard";
import DashboardContent from "@/components/DashboardContent";
import TypeDistribution from "@/components/TypeDistribution";
import { QrCode, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { QR_TYPE_METADATA } from "@/types/qr-content";

export default async function DashboardPage() {
  // Get current user's workspace
  const { workspace, role } = await getCurrentWorkspace();

  // Fetch all codes for this workspace
  const analyticsData = await db
    .select({
      id: qrCodes.id,
      title: qrCodes.title,
      shortCode: qrCodes.shortCode,
      destinationUrl: qrCodes.destinationUrl,
      contentType: qrCodes.contentType,
      createdAt: qrCodes.createdAt,
      status: qrCodes.status,
      scanCount: sql<number>`count(${scans.id})`.mapWith(Number),
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
  
  // Calculate type distribution
  const typeDistribution = analyticsData.reduce((acc, row) => {
    const type = row.contentType || "url";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopularType = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0];
  const uniqueTypes = Object.keys(typeDistribution).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">QR Command Center</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
                  {workspace.name} · <span className="capitalize">{workspace.plan}</span> · {role}
                </p>
              </div>
            </div>
            <div className="self-end sm:self-auto">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total QR Codes" value={totalQRCodes} icon="qr" color="blue" />
          <StatCard title="Total Scans" value={totalScans.toLocaleString()} icon="scans" color="green" />
          <StatCard title="Active Codes" value={activeCodes} icon="active" color="purple" />
          <StatCard 
            title="Content Types" 
            value={uniqueTypes} 
            icon="qr" 
            color="indigo"
            subtitle={mostPopularType ? `${mostPopularType[0]} (${mostPopularType[1]})` : undefined}
          />
        </div>

        {/* Type Distribution Analytics */}
        {analyticsData.length > 0 && (
          <TypeDistribution data={analyticsData} />
        )}

        {/* Create QR Button */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New QR Code
          </Link>
        </div>

        {/* QR Codes Table */}
        <DashboardContent data={analyticsData} />
      </div>
    </div>
  );
}