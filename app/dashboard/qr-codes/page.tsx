import { db } from "../../../db";
import { qrCodes, scans } from "../../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import DashboardContent from "@/components/DashboardContent";

export default async function QRCodesPage() {
  // Get current user's workspace
  const { workspace } = await getCurrentWorkspace();

  // Fetch all codes for this workspace
  const qrCodesData = await db
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

  const totalQRCodes = qrCodesData.length;
  const activeCodes = qrCodesData.filter((row) => row.status === "active").length;
  const totalScans = qrCodesData.reduce((sum, row) => sum + row.scanCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My QR Codes</h1>
          <p className="text-sm text-gray-600 mt-1">
            {totalQRCodes} codes · {activeCodes} active · {totalScans.toLocaleString()} total scans
          </p>
        </div>
      </div>

      {/* Content */}
      <DashboardContent data={qrCodesData} />
    </div>
  );
}
