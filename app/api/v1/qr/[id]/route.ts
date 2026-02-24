import { NextRequest } from 'next/server';
import { db } from '@/db';
import { qrCodes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import bcrypt from 'bcryptjs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/qr/:id
 * Get a specific QR code by ID
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

    // Fetch QR code
    const [qr] = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.id, qrId), eq(qrCodes.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!qr) {
      return apiNotFound('QR code');
    }

    // Return full QR code details (excluding password hash)
    return apiSuccess({
      id: qr.id,
      shortCode: qr.shortCode,
      title: qr.title,
      contentType: qr.contentType,
      contentData: qr.contentData,
      destinationUrl: qr.destinationUrl,
      isDynamic: qr.isDynamic,
      status: qr.status,
      scanUrl: `${env.NEXT_PUBLIC_APP_URL}/q/${qr.shortCode}`,
      currentScans: qr.currentScans,
      maxScans: qr.maxScans,
      isPasswordProtected: qr.isPasswordProtected,
      schedules: qr.schedules,
      languageRoutes: qr.languageRoutes,
      iosUrl: qr.iosUrl,
      androidUrl: qr.androidUrl,
      geofence: qr.geofence,
      expiresAt: qr.expiresAt,
      facebookPixelId: qr.facebookPixelId,
      googleTagManagerId: qr.googleTagManagerId,
      createdAt: qr.createdAt,
      updatedAt: qr.updatedAt,
    });
  } catch (error) {
    logger.error('Failed to get QR code', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve QR code');
  }
}

/**
 * PATCH /api/v1/qr/:id
 * Update a QR code
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const body = await request.json();

    // Check if QR code exists and belongs to workspace
    const [existing] = await db
      .select({ id: qrCodes.id })
      .from(qrCodes)
      .where(and(eq(qrCodes.id, qrId), eq(qrCodes.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!existing) {
      return apiNotFound('QR code');
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date(),
    };

    // Allow updating specific fields
    if (body.title !== undefined) updates.title = body.title;
    if (body.destinationUrl !== undefined) updates.destinationUrl = body.destinationUrl;
    if (body.status !== undefined) updates.status = body.status;
    if (body.contentData !== undefined) {
      updates.contentData = typeof body.contentData === 'string' ? body.contentData : JSON.stringify(body.contentData);
    }
    if (body.schedules !== undefined) updates.schedules = body.schedules;
    if (body.languageRoutes !== undefined) updates.languageRoutes = body.languageRoutes;
    if (body.iosUrl !== undefined) updates.iosUrl = body.iosUrl;
    if (body.androidUrl !== undefined) updates.androidUrl = body.androidUrl;
    if (body.geofence !== undefined) updates.geofence = body.geofence;
    if (body.expiresAt !== undefined) updates.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.maxScans !== undefined) updates.maxScans = body.maxScans;
    if (body.facebookPixelId !== undefined) updates.facebookPixelId = body.facebookPixelId;
    if (body.googleTagManagerId !== undefined) updates.googleTagManagerId = body.googleTagManagerId;

    // Handle password update
    if (body.password !== undefined) {
      if (body.password) {
        updates.password = await bcrypt.hash(body.password, 10);
        updates.isPasswordProtected = true;
      } else {
        updates.password = null;
        updates.isPasswordProtected = false;
      }
    }

    // Update QR code
    const [updated] = await db
      .update(qrCodes)
      .set(updates)
      .where(eq(qrCodes.id, qrId))
      .returning();

    logger.info('QR code updated via API', {
      workspaceId: auth.context.workspaceId,
      qrCodeId: qrId,
    });

    return apiSuccess({
      id: updated.id,
      shortCode: updated.shortCode,
      title: updated.title,
      status: updated.status,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    logger.error('Failed to update QR code', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to update QR code');
  }
}

/**
 * DELETE /api/v1/qr/:id
 * Delete a QR code
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
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

    // Check if QR code exists and belongs to workspace
    const [existing] = await db
      .select({ id: qrCodes.id, shortCode: qrCodes.shortCode })
      .from(qrCodes)
      .where(and(eq(qrCodes.id, qrId), eq(qrCodes.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!existing) {
      return apiNotFound('QR code');
    }

    // Delete QR code (CASCADE will handle related scans and versions)
    await db.delete(qrCodes).where(eq(qrCodes.id, qrId));

    logger.info('QR code deleted via API', {
      workspaceId: auth.context.workspaceId,
      qrCodeId: qrId,
      shortCode: existing.shortCode,
    });

    return apiSuccess({ deleted: true, id: qrId });
  } catch (error) {
    logger.error('Failed to delete QR code', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to delete QR code');
  }
}
