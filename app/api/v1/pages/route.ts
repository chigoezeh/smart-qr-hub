import { NextRequest } from 'next/server';
import { db } from '@/db';
import { landingPages, landingPageLinks } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { authenticateApiRequest } from '@/lib/api-auth';
import { apiSuccess, apiUnauthorized, apiBadRequest, apiNotFound, apiInternalError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import { isReservedSlug } from '@/lib/social-icons';

/**
 * GET /api/v1/pages
 * List all landing pages for the authenticated workspace
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

    // Fetch landing pages for workspace
    const pages = await db
      .select({
        id: landingPages.id,
        slug: landingPages.slug,
        type: landingPages.type,
        theme: landingPages.theme,
        fullName: landingPages.fullName,
        email: landingPages.email,
        phone: landingPages.phone,
        company: landingPages.company,
        createdAt: landingPages.createdAt,
        updatedAt: landingPages.updatedAt,
      })
      .from(landingPages)
      .where(eq(landingPages.workspaceId, auth.context.workspaceId))
      .orderBy(desc(landingPages.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.workspaceId, auth.context.workspaceId));

    return apiSuccess(
      pages.map((p) => ({
        ...p,
        url: `${env.NEXT_PUBLIC_APP_URL}/l/${p.slug}`,
      })),
      {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      }
    );
  } catch (error) {
    logger.error('Failed to list landing pages', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to retrieve landing pages');
  }
}

/**
 * POST /api/v1/pages
 * Create a new landing page
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
    const { slug, type } = body;
    
    if (!slug) {
      return apiBadRequest('slug is required');
    }

    if (!type) {
      return apiBadRequest('type is required');
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return apiBadRequest('slug can only contain lowercase letters, numbers, and hyphens');
    }

    // Check for reserved slugs
    if (isReservedSlug(slug)) {
      return apiBadRequest('This slug is reserved and cannot be used');
    }

    // Check if slug already exists
    const [existing] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.slug, slug))
      .limit(1);

    if (existing) {
      return apiBadRequest('This slug is already taken');
    }

    // Create landing page
    const [newPage] = await db
      .insert(landingPages)
      .values({
        workspaceId: auth.context.workspaceId,
        slug,
        type,
        theme: body.theme || 'default',
        customCss: body.customCss || null,
        fullName: body.fullName || null,
        phone: body.phone || null,
        email: body.email || null,
        company: body.company || null,
        address: body.address || null,
        profilePhotoUrl: body.profilePhotoUrl || null,
      })
      .returning();

    logger.info('Landing page created via API', {
      workspaceId: auth.context.workspaceId,
      pageId: newPage.id,
      slug,
    });

    return apiSuccess(
      {
        id: newPage.id,
        slug: newPage.slug,
        type: newPage.type,
        url: `${env.NEXT_PUBLIC_APP_URL}/l/${newPage.slug}`,
        createdAt: newPage.createdAt,
      },
      undefined,
      201
    );
  } catch (error) {
    logger.error('Failed to create landing page', error, { workspaceId: auth.context.workspaceId });
    return apiInternalError('Failed to create landing page');
  }
}
