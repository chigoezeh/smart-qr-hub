import { NextRequest } from 'next/server';
import { db } from '@/db';
import { qrCodes } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/env';

/**
 * GET /api/v1/qr
 * List all QR codes for the authenticated workspace
 */
export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = await authenticateApiRequest(request);
  if (!auth.authenticated) {
    return apiUnauthorized(auth.error);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    // Fetch QR codes for workspace
    const qrList = await db
      .select({
        id: qrCodes.id,
        shortCode: qrCodes.shortCode,
        title: qrCodes.title,
        contentType: qrCodes.contentType,
        destinationUrl: qrCodes.destinationUrl,
        isDynamic: qrCodes.isDynamic,
        status: qrCodes.status,
        currentScans: qrCodes.currentScans,
        maxScans: qrCodes.maxScans,
        isPasswordProtected: qrCodes.isPasswordProtected,
        createdAt: qrCodes.createdAt,
        updatedAt: qrCodes.updatedAt,
      })
      .from(qrCodes)
      .where(eq(qrCodes.workspaceId, auth.context.workspaceId))
      .orderBy(desc(qrCodes.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: qrCodes.id })
      .from(qrCodes)
      .where(eq(qrCodes.workspaceId, auth.context.workspaceId));

    return apiSuccess(
      qrList.map((qr) => ({
        ...qr,
        scanUrl: `${env.NEXT_PUBLIC_APP_URL}/q/${qr.shortCode}`,
      })),
      {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      }
    );
  } catch (error) {
    logger.error('Failed to list QR codes', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve QR codes');
  }
}

/**
 * POST /api/v1/qr
 * Create a new QR code
 */
export async function POST(request: NextRequest) {
  // Authenticate request
  const auth = await authenticateApiRequest(request);
  if (!auth.authenticated) {
    return apiUnauthorized(auth.error);
  }

  try {
    const body = await request.json();

    // Validate required fields
    const { contentType, contentData, title } = body;
    
    if (!contentType) {
      return apiBadRequest('contentType is required');
    }

    if (!contentData) {
      return apiBadRequest('contentData is required');
    }

    // Generate short code
    const shortCode = crypto.randomBytes(3).toString('hex');

    // Parse optional fields
    const schedules = body.schedules || null;
    const languageRoutes = body.languageRoutes || null;
    const geofence = body.geofence || null;

    // Handle password protection
    let passwordHash = null;
    if (body.password) {
      passwordHash = await bcrypt.hash(body.password, 10);
    }

    // Create QR code
    const [newQR] = await db
      .insert(qrCodes)
      .values({
        workspaceId: auth.context.workspaceId,
        shortCode,
        title: title || 'Untitled QR Code',
        contentType,
        contentData: typeof contentData === 'string' ? contentData : JSON.stringify(contentData),
        destinationUrl: body.destinationUrl || null,
        isDynamic: body.isDynamic !== false, // Default to true
        status: body.status || 'active',
        schedules,
        languageRoutes,
        iosUrl: body.iosUrl || null,
        androidUrl: body.androidUrl || null,
        password: passwordHash,
        isPasswordProtected: !!body.password,
        geofence,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        maxScans: body.maxScans || null,
        facebookPixelId: body.facebookPixelId || null,
        googleTagManagerId: body.googleTagManagerId || null,
      })
      .returning();

    logger.info('QR code created via API', {
      workspaceId: auth.context.workspaceId,
      qrCodeId: newQR.id,
      shortCode,
    });

    return apiSuccess(
      {
        id: newQR.id,
        shortCode: newQR.shortCode,
        title: newQR.title,
        contentType: newQR.contentType,
        scanUrl: `${env.NEXT_PUBLIC_APP_URL}/q/${newQR.shortCode}`,
        status: newQR.status,
        createdAt: newQR.createdAt,
      },
      undefined,
      201
    );
  } catch (error) {
    logger.error('Failed to create QR code', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to create QR code');
  }
}
