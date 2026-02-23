import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages, landingPageLinks, landingPageClicks, workspaceMembers } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, TrendingUp, MousePointerClick, Globe2, MapPin } from "lucide-react";

export default async function LandingPageAnalytics({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const pageId = parseInt(params.id);
  if (isNaN(pageId)) notFound();

  // Get user's workspace
  const membership = await db.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, user.id),
  });

  if (!membership) redirect("/onboarding");

  // Fetch landing page
  const page = await db.query.landingPages.findFirst({
    where: and(eq(landingPages.id, pageId), eq(landingPages.workspaceId, membership.workspaceId)),
  });

  if (!page) notFound();

  // Fetch links with click counts
  const linksWithClicks = await db
    .select({
      id: landingPageLinks.id,
      title: landingPageLinks.title,
      url: landingPageLinks.url,
      icon: landingPageLinks.icon,
      displayOrder: landingPageLinks.displayOrder,
      clickCount: sql<number>`count(${landingPageClicks.id})::int`,
    })
    .from(landingPageLinks)
    .leftJoin(landingPageClicks, eq(landingPageClicks.landingPageLinkId, landingPageLinks.id))
    .where(eq(landingPageLinks.landingPageId, pageId))
    .groupBy(
      landingPageLinks.id,
      landingPageLinks.title,
      landingPageLinks.url,
      landingPageLinks.icon,
      landingPageLinks.displayOrder
    )
    .orderBy(desc(sql<number>`count(${landingPageClicks.id})`));

  // Get recent clicks
  const recentClicks = await db
    .select({
      id: landingPageClicks.id,
      linkTitle: landingPageLinks.title,
      clickedAt: landingPageClicks.clickedAt,
      country: landingPageClicks.country,
      city: landingPageClicks.city,
      userAgent: landingPageClicks.userAgent,
    })
    .from(landingPageClicks)
    .innerJoin(landingPageLinks, eq(landingPageClicks.landingPageLinkId, landingPageLinks.id))
    .where(eq(landingPageLinks.landingPageId, pageId))
    .orderBy(desc(landingPageClicks.clickedAt))
    .limit(20);

  // Calculate total clicks
  const totalClicks = linksWithClicks.reduce((sum, link) => sum + link.clickCount, 0);

  // Get top countries
  const topCountries = await db
    .select({
      country: landingPageClicks.country,
      count: sql<number>`count(*)::int`,
    })
    .from(landingPageClicks)
    .innerJoin(landingPageLinks, eq(landingPageClicks.landingPageLinkId, landingPageLinks.id))
    .where(
      and(
        eq(landingPageLinks.landingPageId, pageId),
        sql`${landingPageClicks.country} IS NOT NULL`
      )
    )
    .groupBy(landingPageClicks.country)
    .orderBy(desc(sql<number>`count(*)`))
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/pages"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500">/{page.slug}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MousePointerClick className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Links</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{linksWithClicks.length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe2 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Countries</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{topCountries.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Link Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Link Performance</h2>
            {linksWithClicks.length > 0 ? (
              <div className="space-y-3">
                {linksWithClicks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {link.icon && <span className="text-xl">{link.icon}</span>}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{link.title}</p>
                        <p className="text-xs text-gray-500 truncate">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {link.clickCount} clicks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No links yet</p>
            )}
          </div>

          {/* Top Countries */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h2>
            {topCountries.length > 0 ? (
              <div className="space-y-3">
                {topCountries.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.country}</span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {item.count} clicks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No geographic data yet</p>
            )}
          </div>
        </div>

        {/* Recent Clicks */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Clicks</h2>
          {recentClicks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Link</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClicks.map((click) => (
                    <tr key={click.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{click.linkTitle}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {click.city && click.country
                          ? `${click.city}, ${click.country}`
                          : click.country || "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(click.clickedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No clicks recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
