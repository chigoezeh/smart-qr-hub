import { db } from "../../../db";
import { qrCodes, scans } from "../../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import DashboardContent from "@/components/DashboardContent";
import { QrCode, Plus, LayoutGrid, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function QRCodesPage() {
  // Get current user's workspace
  const { workspace, role } = await getCurrentWorkspace();

  if (!workspace) {
    redirect("/onboarding");
  }

  // Fetch all codes for this workspace
  const qrCodesData = await db
    .select({
      id: qrCodes.id,
      title: qrCodes.title,
      shortCode: qrCodes.shortCode,
      destinationUrl: qrCodes.destinationUrl,
      contentType: qrCodes.contentType,
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

  const totalQRCodes = qrCodesData.length;
  const activeCodes = qrCodesData.filter((row) => row.status === "active").length;
  const totalScans = qrCodesData.reduce((sum, row) => sum + row.scanCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My QR Codes</h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {totalQRCodes} codes · {activeCodes} active · {totalScans.toLocaleString()} total scans
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create QR Code</span>
                <span className="sm:hidden">Create</span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <DashboardContent data={qrCodesData} />
      </div>
    </div>
  );
}
