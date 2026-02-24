import { NextRequest } from 'next/server';
import { db } from '@/db';
import { landingPages, landingPageLinks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/v1/pages/:id/links
 * Add a link to a landing page
 */
export async function POST(request: NextRequest, context: RouteContext) {
  // Authenticate request
  const auth = await authenticateApiRequest(request);
  if (!auth.authenticated) {
    return apiUnauthorized(auth.error);
  }

  try {
    const { id } = await context.params;
    const pageId = parseInt(id);

    if (isNaN(pageId)) {
      return apiBadRequest('Invalid page ID');
    }

    const body = await request.json();

    // Validate required fields
    const { title, url } = body;
    
    if (!title) {
      return apiBadRequest('title is required');
    }

    if (!url) {
      return apiBadRequest('url is required');
    }

    // Check if page exists and belongs to workspace
    const [page] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(and(eq(landingPages.id, pageId), eq(landingPages.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!page) {
      return apiNotFound('Landing page');
    }

    // Get next display order
    const [lastLink] = await db
      .select({ displayOrder: landingPageLinks.displayOrder })
      .from(landingPageLinks)
      .where(eq(landingPageLinks.landingPageId, pageId))
      .orderBy(landingPageLinks.displayOrder)
      .limit(1);

    const displayOrder = body.displayOrder !== undefined ? body.displayOrder : (lastLink?.displayOrder || 0) + 1;

    // Create link
    const [newLink] = await db
      .insert(landingPageLinks)
      .values({
        landingPageId: pageId,
        title,
        url,
        icon: body.icon || null,
        displayOrder,
      })
      .returning();

    logger.info('Link added to landing page via API', {
      workspaceId: auth.context.workspaceId,
      pageId,
      linkId: newLink.id,
    });

    return apiSuccess(newLink, undefined, 201);
  } catch (error) {
    logger.error('Failed to add link', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to add link');
  }
}
