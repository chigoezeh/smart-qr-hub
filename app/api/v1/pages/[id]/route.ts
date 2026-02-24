import { NextRequest } from 'next/server';
import { db } from '@/db';
import { landingPages, landingPageLinks } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/pages/:id
 * Get a specific landing page with its links
 */
export async function GET(request: NextRequest, context: RouteContext) {
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

    // Fetch landing page
    const [page] = await db
      .select()
      .from(landingPages)
      .where(and(eq(landingPages.id, pageId), eq(landingPages.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!page) {
      return apiNotFound('Landing page');
    }

    // Fetch links for this page
    const links = await db
      .select({
        id: landingPageLinks.id,
        title: landingPageLinks.title,
        url: landingPageLinks.url,
        icon: landingPageLinks.icon,
        displayOrder: landingPageLinks.displayOrder,
        createdAt: landingPageLinks.createdAt,
      })
      .from(landingPageLinks)
      .where(eq(landingPageLinks.landingPageId, pageId))
      .orderBy(landingPageLinks.displayOrder);

    return apiSuccess({
      ...page,
      url: `${env.NEXT_PUBLIC_APP_URL}/l/${page.slug}`,
      links,
    });
  } catch (error) {
    logger.error('Failed to get landing page', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve landing page');
  }
}

/**
 * PATCH /api/v1/pages/:id
 * Update a landing page
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
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

    // Check if page exists and belongs to workspace
    const [existing] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(and(eq(landingPages.id, pageId), eq(landingPages.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!existing) {
      return apiNotFound('Landing page');
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date(),
    };

    // Allow updating specific fields
    if (body.theme !== undefined) updates.theme = body.theme;
    if (body.customCss !== undefined) updates.customCss = body.customCss;
    if (body.fullName !== undefined) updates.fullName = body.fullName;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.email !== undefined) updates.email = body.email;
    if (body.company !== undefined) updates.company = body.company;
    if (body.address !== undefined) updates.address = body.address;
    if (body.profilePhotoUrl !== undefined) updates.profilePhotoUrl = body.profilePhotoUrl;

    // Update landing page
    const [updated] = await db
      .update(landingPages)
      .set(updates)
      .where(eq(landingPages.id, pageId))
      .returning();

    logger.info('Landing page updated via API', {
      workspaceId: auth.context.workspaceId,
      pageId,
    });

    return apiSuccess({
      id: updated.id,
      slug: updated.slug,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    logger.error('Failed to update landing page', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to update landing page');
  }
}

/**
 * DELETE /api/v1/pages/:id
 * Delete a landing page
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
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

    // Check if page exists and belongs to workspace
    const [existing] = await db
      .select({ id: landingPages.id, slug: landingPages.slug })
      .from(landingPages)
      .where(and(eq(landingPages.id, pageId), eq(landingPages.workspaceId, auth.context.workspaceId)))
      .limit(1);

    if (!existing) {
      return apiNotFound('Landing page');
    }

    // Delete landing page (CASCADE will handle links and clicks)
    await db.delete(landingPages).where(eq(landingPages.id, pageId));

    logger.info('Landing page deleted via API', {
      workspaceId: auth.context.workspaceId,
      pageId,
      slug: existing.slug,
    });

    return apiSuccess({ deleted: true, id: pageId });
  } catch (error) {
    logger.error('Failed to delete landing page', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to delete landing page');
  }
}
