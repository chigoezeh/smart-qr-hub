import { db } from "../../db";
import { qrCodes, scans } from "../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import CreateQRForm from "../../components/CreateQRForm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { UserButton } from "@clerk/nextjs";
import StatCard from "@/components/StatCard";
import QRTableRow from "@/components/QRTableRow";
import { QrCode } from "lucide-react";

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
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QR Command Center</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {workspace.name} · <span className="capitalize">{workspace.plan}</span> · {role}
                </p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total QR Codes" value={totalQRCodes} icon="qr" color="blue" />
          <StatCard title="Total Scans" value={totalScans.toLocaleString()} icon="scans" color="green" />
          <StatCard title="Active Codes" value={activeCodes} icon="active" color="purple" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Generator Form */}
          <div className="lg:col-span-1">
            <CreateQRForm />
          </div>

          {/* Right Column: Analytics Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <h2 className="text-xl font-bold text-gray-800">Active Links & Performance</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {totalQRCodes} total {totalQRCodes === 1 ? "link" : "links"}
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 text-left">QR Code</th>
                      <th className="p-4 text-left">Destination</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-right">Scans</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {analyticsData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <QrCode className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="font-medium">No QR codes yet</p>
                            <p className="text-sm">Create your first smart link to get started!</p>
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
      </div>
    </div>
  );
}