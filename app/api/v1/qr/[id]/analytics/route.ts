import { NextRequest } from 'next/server';
import { db } from '@/db';
import { qrCodes, scans } from '@/db/schema';
import { eq, and, desc, sql, gte } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/qr/:id/analytics
 * Get analytics for a specific QR code
 */
export async function GET(request: NextRequest, context: RouteContext) {
  // Authenticate request
  const auth = await authenticateApiRequest(request);
  if (!auth.authenticated) {
    return apiUnauthorized(auth.error);
  }

  try {
    const { id } = await context.params;
    const qrId = parseInt(id);

    if (isNaN(qrId)) {
      return apiBadRequest('Invalid QR code ID');
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Check if QR code exists and belongs to workspace
    const [qr] = await db
      .select({
        id: qrCodes.id,
        shortCode: qrCodes.shortCode,
        title: qrCodes.title,
        currentScans: qrCodes.currentScans,
      })
      .from(qrCodes)
      .where(and(eq(qrCodes.id, qrId), eq(qrCodes.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!qr) {
      return apiNotFound('QR code');
    }

    // Calculate date range
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Get total scans in period
    const [totalScans] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrId), gte(scans.scannedAt, dateFrom)));

    // Get scans by country
    const scansByCountry = await db
      .select({
        country: scans.country,
        count: sql<number>`count(*)::int`,
      })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrId), gte(scans.scannedAt, dateFrom)))
      .groupBy(scans.country)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get scans by device type
    const scansByDevice = await db
      .select({
        deviceType: scans.deviceType,
        count: sql<number>`count(*)::int`,
      })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrId), gte(scans.scannedAt, dateFrom)))
      .groupBy(scans.deviceType)
      .orderBy(desc(sql`count(*)`));

    // Get scans by OS
    const scansByOS = await db
      .select({
        os: scans.os,
        count: sql<number>`count(*)::int`,
      })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrId), gte(scans.scannedAt, dateFrom)))
      .groupBy(scans.os)
      .orderBy(desc(sql`count(*)`));

    // Get daily scans for the period
    const dailyScans = await db
      .select({
        date: sql<string>`DATE(scanned_at)`,
        count: sql<number>`count(*)::int`,
      })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrId), gte(scans.scannedAt, dateFrom)))
      .groupBy(sql`DATE(scanned_at)`)
      .orderBy(sql`DATE(scanned_at)`);

    // Get recent scans
    const recentScans = await db
      .select({
        id: scans.id,
        scannedAt: scans.scannedAt,
        country: scans.country,
        city: scans.city,
        os: scans.os,
        deviceType: scans.deviceType,
      })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrId), gte(scans.scannedAt, dateFrom)))
      .orderBy(desc(scans.scannedAt))
      .limit(20);

    return apiSuccess({
      qrCode: {
        id: qr.id,
        shortCode: qr.shortCode,
        title: qr.title,
        totalScans: qr.currentScans,
      },
      period: {
        days,
        from: dateFrom.toISOString(),
        to: new Date().toISOString(),
      },
      summary: {
        totalScans: totalScans.count,
        uniqueCountries: scansByCountry.length,
      },
      scansByCountry: scansByCountry.map((s) => ({
        country: s.country || 'Unknown',
        count: s.count,
      })),
      scansByDevice: scansByDevice.map((s) => ({
        deviceType: s.deviceType || 'Unknown',
        count: s.count,
      })),
      scansByOS: scansByOS.map((s) => ({
        os: s.os || 'Unknown',
        count: s.count,
      })),
      dailyScans: dailyScans.map((s) => ({
        date: s.date,
        count: s.count,
      })),
      recentScans,
    });
  } catch (error) {
    logger.error('Failed to get QR analytics', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve analytics');
  }
}
