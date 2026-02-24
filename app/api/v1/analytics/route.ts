import { NextRequest } from 'next/server';
import { db } from '@/db';
import { qrCodes, scans, landingPages, landingPageLinks, landingPageClicks } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

/**
 * GET /api/v1/analytics
 * Get workspace-wide analytics overview
 */
export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = await authenticateApiRequest(request);
  if (!auth.authenticated) {
    return apiUnauthorized(auth.error);
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Get total QR codes
    const [{ qrCount }] = await db
      .select({ qrCount: sql<number>`count(*)::int` })
      .from(qrCodes)
      .where(eq(qrCodes.workspaceId, auth.context.workspaceId));

    // Get total scans
    const [{ totalScans }] = await db
      .select({ totalScans: sql<number>`count(*)::int` })
      .from(scans)
      .innerJoin(qrCodes, eq(scans.qrCodeId, qrCodes.id))
      .where(eq(qrCodes.workspaceId, auth.context.workspaceId));

    // Get recent scans (in period)
    const [{ recentScans }] = await db
      .select({ recentScans: sql<number>`count(*)::int` })
      .from(scans)
      .innerJoin(qrCodes, eq(scans.qrCodeId, qrCodes.id))
      .where(
        and(
          eq(qrCodes.workspaceId, auth.context.workspaceId),
          gte(scans.scannedAt, dateFrom)
        )
      );

    // Get total landing pages
    const [{ pageCount }] = await db
      .select({ pageCount: sql<number>`count(*)::int` })
      .from(landingPages)
      .where(eq(landingPages.workspaceId, auth.context.workspaceId));

    // Get total landing page clicks
    const [{ pageClicks }] = await db
      .select({ pageClicks: sql<number>`count(*)::int` })
      .from(landingPageClicks)
      .innerJoin(landingPageLinks, eq(landingPageClicks.landingPageLinkId, landingPageLinks.id))
      .innerJoin(landingPages, eq(landingPageLinks.landingPageId, landingPages.id))
      .where(eq(landingPages.workspaceId, auth.context.workspaceId));

    // Get top performing QR codes
    const topQRs = await db
      .select({
        id: qrCodes.id,
        shortCode: qrCodes.shortCode,
        title: qrCodes.title,
        scans: qrCodes.currentScans,
      })
      .from(qrCodes)
      .where(eq(qrCodes.workspaceId, auth.context.workspaceId))
      .orderBy(qrCodes.currentScans)
      .limit(10);

    // Get scans by country (for the period)
    const scansByCountry = await db
      .select({
        country: scans.country,
        count: sql<number>`count(*)::int`,
      })
      .from(scans)
      .innerJoin(qrCodes, eq(scans.qrCodeId, qrCodes.id))
      .where(
        and(
          eq(qrCodes.workspaceId, auth.context.workspaceId),
          gte(scans.scannedAt, dateFrom)
        )
      )
      .groupBy(scans.country)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    return apiSuccess({
      workspace: {
        id: auth.context.workspaceId,
        name: auth.context.workspaceName,
      },
      period: {
        days,
        from: dateFrom.toISOString(),
        to: new Date().toISOString(),
      },
      summary: {
        totalQRCodes: qrCount,
        totalScans,
        scansInPeriod: recentScans,
        totalLandingPages: pageCount,
        totalPageClicks: pageClicks,
      },
      topQRCodes: topQRs,
      scansByCountry: scansByCountry.map((s) => ({
        country: s.country || 'Unknown',
        count: s.count,
      })),
    });
  } catch (error) {
    logger.error('Failed to get analytics overview', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve analytics');
  }
}
