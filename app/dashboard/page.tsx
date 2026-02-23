import { db } from "../../db";
import { qrCodes, scans } from "../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { UserButton } from "@clerk/nextjs";
import StatCard from "@/components/StatCard";
import QRTableRow from "@/components/QRTableRow";
import { QrCode, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total QR Codes" value={totalQRCodes} icon="qr" color="blue" />
          <StatCard title="Total Scans" value={totalScans.toLocaleString()} icon="scans" color="green" />
          <StatCard title="Active Codes" value={activeCodes} icon="active" color="purple" />
        </div>

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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-4 sm:px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Active Links & Performance
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                  {totalQRCodes} total {totalQRCodes === 1 ? "link" : "links"} · Monitor scans and engagement in real-time
                </p>
              </div>
              <div className="hidden sm:block">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 text-xs font-bold uppercase tracking-wider border-b-2 border-gray-200">
                  <th className="p-4 text-left">QR Code</th>
                  <th className="p-4 text-left hidden sm:table-cell">Destination</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analyticsData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 sm:p-16 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-500">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                          <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-base sm:text-lg text-gray-900 mb-1">No QR codes yet</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Create your first smart link to unlock powerful analytics
                          </p>
                        </div>
                        <Link
                          href="/dashboard/create"
                          className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Create First QR Code
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  analyticsData.map((row) => (
                    <QRTableRow
                      key={row.id}
                      id={row.id}
                      title={row.title || "Untitled"}
                      shortCode={row.shortCode}
                      destinationUrl={row.destinationUrl}
                      status={row.status || "active"}
                      scanCount={row.scanCount}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}