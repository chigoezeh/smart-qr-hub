import { NextRequest } from 'next/server';
import { db } from '@/db';
import { webhooks } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

/**
 * GET /api/v1/webhooks
 * List all webhooks for the authenticated workspace
 */
export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = await authenticateApiRequest(request);
  if (!auth.authenticated) {
    return apiUnauthorized(auth.error);
  }

  try {
    // Fetch webhooks for workspace
    const webhookList = await db
      .select({
        id: webhooks.id,
        url: webhooks.url,
        events: webhooks.events,
        isActive: webhooks.isActive,
        createdAt: webhooks.createdAt,
        lastSuccessAt: webhooks.lastSuccessAt,
        lastFailureAt: webhooks.lastFailureAt,
      })
      .from(webhooks)
      .where(eq(webhooks.workspaceId, auth.context.workspaceId))
      .orderBy(desc(webhooks.createdAt));

    return apiSuccess(webhookList);
  } catch (error) {
    logger.error('Failed to list webhooks', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve webhooks');
  }
}

/**
 * POST /api/v1/webhooks
 * Create a new webhook
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
    const { url, events } = body;
    
    if (!url) {
      return apiBadRequest('url is required');
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return apiBadRequest('events is required and must be a non-empty array');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return apiBadRequest('Invalid URL format');
    }

    // Validate events
    const validEvents = ['qr.created', 'qr.updated', 'qr.deleted', 'qr.scanned', 'page.created', 'page.updated', 'page.deleted'];
    for (const event of events) {
      if (!validEvents.includes(event)) {
        return apiBadRequest(`Invalid event: ${event}. Valid events: ${validEvents.join(', ')}`);
      }
    }

    // Generate webhook secret for HMAC signing
    const secret = crypto.randomBytes(32).toString('hex');

    // Create webhook
    const [newWebhook] = await db
      .insert(webhooks)
      .values({
        workspaceId: auth.context.workspaceId,
        url,
        events,
        secret,
        isActive: true,
      })
      .returning();

    logger.info('Webhook created via API', {
      workspaceId: auth.context.workspaceId,
      webhookId: newWebhook.id,
      url,
    });

    return apiSuccess(
      {
        id: newWebhook.id,
        url: newWebhook.url,
        events: newWebhook.events,
        secret: newWebhook.secret, // Return secret once so user can store it
        isActive: newWebhook.isActive,
        createdAt: newWebhook.createdAt,
      },
      undefined,
      201
    );
  } catch (error) {
    logger.error('Failed to create webhook', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to create webhook');
  }
}
