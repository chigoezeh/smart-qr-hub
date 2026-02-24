"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages, landingPageViews, landingPageBlocks, workspaceMembers } from "@/db/schema";
import { and, eq, gte, desc, sql, count } from "drizzle-orm";

export async function getPageAnalytics(pageId: number, days = 30) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    // Get user's workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, userId),
    });

    if (!membership) {
      return { error: "No workspace found" };
    }

    // Verify page ownership through workspace
    const page = await db.query.landingPages.findFirst({
      where: and(
        eq(landingPages.id, pageId),
        eq(landingPages.workspaceId, membership.workspaceId)
      ),
    });

    if (!page) {
      return { error: "Page not found" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all views for this page in the date range
    const views = await db.query.landingPageViews.findMany({
      where: and(
        eq(landingPageViews.landingPageId, pageId),
        gte(landingPageViews.viewedAt, startDate)
      ),
      orderBy: [desc(landingPageViews.viewedAt)],
    });

    // Calculate total views
    const totalViews = views.length;

    // Calculate unique visitors (approximate by counting unique combinations of os, device, country)
    const uniqueVisitors = new Set(
      views.map(v => `${v.os}-${v.deviceType}-${v.country}`)
    ).size;

    // Calculate average time on page
    const viewsWithTime = views.filter(v => v.timeOnPage);
    const avgTimeOnPage = viewsWithTime.length > 0
      ? Math.floor(viewsWithTime.reduce((sum, v) => sum + (v.timeOnPage || 0), 0) / viewsWithTime.length)
      : 0;

    // Calculate conversion rate
    const conversions = views.filter(v => v.didConvert).length;
    const conversionRate = totalViews > 0 ? (conversions / totalViews) * 100 : 0;

    // Device breakdown
    const deviceBreakdown = views.reduce((acc, view) => {
      const device = view.deviceType || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // OS breakdown
    const osBreakdown = views.reduce((acc, view) => {
      const os = view.os || "Unknown";
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Country breakdown
    const countryBreakdown = views.reduce((acc, view) => {
      const country = view.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top 5 countries
    const topCountries = Object.entries(countryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Referrer breakdown
    const referrerBreakdown = views.reduce((acc, view) => {
      const referrer = view.referrer || "Direct";
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top 5 referrers
    const topReferrers = Object.entries(referrerBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count }));

    // Views over time (daily)
    const viewsByDate = views.reduce((acc, view) => {
      const date = view.viewedAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Fill in missing dates with 0 views
    const viewsTimeline = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      viewsTimeline.push({
        date: dateStr,
        views: viewsByDate[dateStr] || 0,
      });
    }

    // Block engagement (most viewed blocks)
    const blockViews = views.reduce((acc, view) => {
      if (view.blocksViewed) {
        const blocks = view.blocksViewed as number[];
        blocks.forEach(blockId => {
          acc[blockId] = (acc[blockId] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<number, number>);

    // Get block details for top blocks
    const topBlockIds = Object.entries(blockViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => Number(id));

    let topBlocksWithViews: Array<{ id: number; blockType: string; title: string | null; views: number }> = [];
    
    if (topBlockIds.length > 0) {
      const topBlocks = await db
        .select({
          id: landingPageBlocks.id,
          blockType: landingPageBlocks.blockType,
          title: landingPageBlocks.title,
        })
        .from(landingPageBlocks)
        .where(sql`${landingPageBlocks.id} = ANY(${topBlockIds})`);

      topBlocksWithViews = topBlocks.map(block => ({
        ...block,
        views: blockViews[block.id] || 0,
      })).sort((a, b) => b.views - a.views);
    }

    // UTM campaign tracking
    const utmCampaigns = views
      .filter(v => v.utmCampaign)
      .reduce((acc, view) => {
        const campaign = view.utmCampaign!;
        if (!acc[campaign]) {
          acc[campaign] = {
            campaign,
            views: 0,
            conversions: 0,
            sources: new Set<string>(),
          };
        }
        acc[campaign].views++;
        if (view.didConvert) acc[campaign].conversions++;
        if (view.utmSource) acc[campaign].sources.add(view.utmSource);
        return acc;
      }, {} as Record<string, any>);

    const utmCampaignStats = Object.values(utmCampaigns).map((c: any) => ({
      campaign: c.campaign as string,
      views: c.views as number,
      conversions: c.conversions as number,
      conversionRate: c.views > 0 ? (c.conversions / c.views) * 100 : 0,
      sources: Array.from(c.sources) as string[],
    }));

    return {
      success: true,
      data: {
        summary: {
          totalViews,
          uniqueVisitors,
          avgTimeOnPage,
          conversions,
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
        viewsTimeline,
        deviceBreakdown,
        osBreakdown,
        topCountries,
        topReferrers,
        topBlocks: topBlocksWithViews,
        utmCampaigns: utmCampaignStats,
      },
    };
  } catch (error) {
    console.error("Error fetching page analytics:", error);
    return { error: "Failed to fetch analytics" };
  }
}

export async function getAllPagesAnalytics() {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    // Get user's workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, userId),
    });

    if (!membership) {
      return { error: "No workspace found" };
    }

    const userPages = await db.query.landingPages.findMany({
      where: eq(landingPages.workspaceId, membership.workspaceId),
      columns: { id: true, headerTitle: true, slug: true },
    });

    const pagesWithStats = await Promise.all(
      userPages.map(async (page) => {
        const viewCount = await db
          .select({ count: count() })
          .from(landingPageViews)
          .where(eq(landingPageViews.landingPageId, page.id));

        return {
          ...page,
          views: viewCount[0]?.count || 0,
        };
      })
    );

    return { success: true, data: pagesWithStats };
  } catch (error) {
    console.error("Error fetching all pages analytics:", error);
    return { error: "Failed to fetch analytics" };
  }
}
