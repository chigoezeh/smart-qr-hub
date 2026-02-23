import { db } from "../../db";
import { qrCodes, scans } from "../../db/schema";
import { desc, eq, sql } from "drizzle-orm";
import CreateQRForm from "../../components/CreateQRForm";

export default async function DashboardPage() {
  // Fetch all codes and join with scans to get the total scan count per code
  const analyticsData = await db
    .select({
      id: qrCodes.id,
      title: qrCodes.title,
      shortCode: qrCodes.shortCode,
      destinationUrl: qrCodes.destinationUrl,
      createdAt: qrCodes.createdAt,
      scanCount: sql<number>`count(${scans.id})`.mapWith(Number),
    })
    .from(qrCodes)
    .leftJoin(scans, eq(qrCodes.id, scans.qrCodeId))
    .groupBy(qrCodes.id)
    .orderBy(desc(qrCodes.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">QR Command Center</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Generator Form */}
          <div className="lg:col-span-1">
            <CreateQRForm />
          </div>

          {/* Right Column: Analytics Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Active Links & Performance</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium">Title & Code</th>
                    <th className="p-4 font-medium">Destination</th>
                    <th className="p-4 font-medium text-right">Total Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analyticsData.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">
                        No QR codes generated yet. Create your first one!
                      </td>
                    </tr>
                  ) : (
                    analyticsData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-gray-900">{row.title}</p>
                          <p className="text-xs text-gray-500 font-mono mt-1">/q/{row.shortCode}</p>
                        </td>
                        <td className="p-4">
                          <a href={row.destinationUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-xs block">
                            {row.destinationUrl}
                          </a>
                        </td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-bold">
                            {row.scanCount}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}