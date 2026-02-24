import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPageAnalytics } from "@/actions/analytics";
import { db } from "@/db";
import { landingPages, workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import ViewsOverTimeChart from "@/components/analytics/ViewsOverTimeChart";
import DeviceBreakdownChart from "@/components/analytics/DeviceBreakdownChart";
import TopCountriesChart from "@/components/analytics/TopCountriesChart";
import ExportLandingPageCSV from "@/components/analytics/ExportLandingPageCSV";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function PageAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const pageId = parseInt(id);

  if (isNaN(pageId)) {
    notFound();
  }

  // Get user's workspace
  const membership = await db.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, userId),
  });

  if (!membership) {
    redirect("/onboarding");
  }

  // Get page details
  const page = await db.query.landingPages.findFirst({
    where: and(
      eq(landingPages.id, pageId),
      eq(landingPages.workspaceId, membership.workspaceId)
    ),
  });

  if (!page) {
    notFound();
  }

  // Get analytics data (last 30 days by default)
  const result = await getPageAnalytics(pageId, 30);

  if (result.error || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error loading analytics: {result.error}
          </div>
        </div>
      </div>
    );
  }

  const { data } = result;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumbs />
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {page.headerTitle || page.slug}
              </h1>
              <p className="text-gray-600 mt-1">Analytics for /{page.slug}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/pages/${page.id}/edit`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
              </Link>
              <ExportLandingPageCSV
                data={data}
                pageTitle={page.headerTitle || page.slug}
                slug={page.slug}
              />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <AnalyticsSummary data={data.summary} />

        {/* Views Over Time Chart */}
        <ViewsOverTimeChart data={data.viewsTimeline} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Breakdown */}
          <DeviceBreakdownChart data={data.deviceBreakdown} />

          {/* Top Countries */}
          <TopCountriesChart data={data.topCountries} />
        </div>

        {/* Top Blocks */}
        {data.topBlocks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Most Viewed Blocks</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Block
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.topBlocks.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {block.title || "Untitled Block"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {block.blockType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {block.views}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Referrers */}
        {data.topReferrers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.topReferrers.map((ref, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-md">
                        {ref.referrer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {ref.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
