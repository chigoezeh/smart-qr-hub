import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages, landingPageViews, qrCodes, scans, workspaceMembers } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageId = parseInt(searchParams.get("pageId") || "0");
  const timeRange = searchParams.get("timeRange") || "30d";

  if (!pageId) {
    return NextResponse.json({ error: "Page ID required" }, { status: 400 });
  }

  // Get user's workspace
  const membership = await db.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, userId),
  });

  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }

  // Verify page belongs to workspace
  const page = await db.query.landingPages.findFirst({
    where: and(
      eq(landingPages.id, pageId),
      eq(landingPages.workspaceId, membership.workspaceId)
    ),
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Calculate date range
  const days = parseInt(timeRange.replace("d", ""));
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get QR codes linked to this page
  const linkedQRs = await db
    .select()
    .from(qrCodes)
    .where(and(
      eq(qrCodes.workspaceId, membership.workspaceId),
      eq(qrCodes.landingPageId, pageId)
    ));

  const linkedQRIds = linkedQRs.map(qr => qr.id);

  // Get QR scans
  let qrScansCount = 0;
  let qrScansBySource: Array<{ source: string; scans: number }> = [];

  if (linkedQRIds.length > 0) {
    const qrScansData = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(scans)
      .where(and(
        sql`${scans.qrCodeId} IN (${sql.join(linkedQRIds.map(id => sql`${id}`), sql`, `)})`,
        gte(scans.scannedAt, startDate)
      ));

    qrScansCount = qrScansData[0]?.count || 0;

    // Get scans by UTM source
    const scansBySourceData = await db
      .select({
        source: scans.utmSource,
        scans: sql<number>`count(*)::int`,
      })
      .from(scans)
      .where(and(
        sql`${scans.qrCodeId} IN (${sql.join(linkedQRIds.map(id => sql`${id}`), sql`, `)})`,
        gte(scans.scannedAt, startDate)
      ))
      .groupBy(scans.utmSource);

    qrScansBySource = scansBySourceData.map(row => ({
      source: row.source || "Direct",
      scans: row.scans,
    }));
  }

  // Get direct page views (not from QR codes)
  const pageViewsData = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(landingPageViews)
    .where(and(
      eq(landingPageViews.landingPageId, pageId),
      gte(landingPageViews.viewedAt, startDate)
    ));

  const pageViewsCount = pageViewsData[0]?.count || 0;

  // Get total conversions (simplified - you can enhance this based on your conversion tracking)
  const conversionsData = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(landingPageViews)
    .where(and(
      eq(landingPageViews.landingPageId, pageId),
      gte(landingPageViews.viewedAt, startDate),
      sql`${landingPageViews.customEvents} IS NOT NULL AND jsonb_array_length(${landingPageViews.customEvents}) > 0`
    ));

  const totalConversions = conversionsData[0]?.count || 0;

  return NextResponse.json({
    qrScans: qrScansCount,
    pageViews: pageViewsCount,
    totalConversions,
    linkedQRCodes: linkedQRIds.length,
    qrScansBySource,
    viewsOverTime: [], // TODO: Implement time series data
  });
}
