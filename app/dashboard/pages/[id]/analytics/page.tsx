import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPageAnalytics } from "@/actions/analytics";
import { db } from "@/db";
import { landingPages, workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import UnifiedAnalytics from "@/components/UnifiedAnalytics";
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
            
            <Link
              href={`/dashboard/pages/${page.id}/edit`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Unified Analytics - QR + Page Views */}
        <UnifiedAnalytics pageId={pageId} pageSlug={page.slug} />
        
        {/* Detailed Page Analytics */}
        <AnalyticsDashboard
          pageId={pageId}
          pageTitle={page.headerTitle || page.slug}
          slug={page.slug}
          initialData={data}
          initialDays={30}
        />
      </div>
    </div>
  );
}
