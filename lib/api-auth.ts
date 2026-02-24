import { NextRequest } from 'next/server';
import { db } from '@/db';
import { apiKeys, workspaces } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

/**
 * API Authentication Middleware
 * 
 * Validates API keys and attaches workspace info to requests
 */

export interface ApiContext {
  workspaceId: number;
  workspaceName: string;
  apiKeyId: number;
}

/**
 * Authenticate API request using API key from Authorization header
 * 
 * Expected format: Authorization: Bearer sk_live_...
 */
export async function authenticateApiRequest(
  request: NextRequest
): Promise<{ authenticated: false; error: string } | { authenticated: true; context: ApiContext }> {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { authenticated: false, error: 'Missing Authorization header' };
    }

    // Expected format: "Bearer sk_live_..."
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return { authenticated: false, error: 'Invalid Authorization header format. Expected: Bearer <api_key>' };
    }

    const apiKey = parts[1];

    // Validate API key format
    if (!apiKey.startsWith('sk_live_') && !apiKey.startsWith('sk_test_')) {
      return { authenticated: false, error: 'Invalid API key format' };
    }

    // Hash the API key for database lookup
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Look up API key in database
    const result = await db
      .select({
        apiKeyId: apiKeys.id,
        workspaceId: apiKeys.workspaceId,
        workspaceName: workspaces.name,
        isActive: apiKeys.isActive,
      })
      .from(apiKeys)
      .innerJoin(workspaces, eq(apiKeys.workspaceId, workspaces.id))
      .where(eq(apiKeys.keyHash, keyHash))
      .limit(1);

    if (result.length === 0) {
      logger.warn('Invalid API key attempted', { keyPrefix: apiKey.substring(0, 15) });
      return { authenticated: false, error: 'Invalid API key' };
    }

    const apiKeyRecord = result[0];

    // Check if API key is active
    if (!apiKeyRecord.isActive) {
      logger.warn('Inactive API key attempted', { apiKeyId: apiKeyRecord.apiKeyId });
      return { authenticated: false, error: 'API key is inactive' };
    }

    // Update last used timestamp (fire and forget)
    db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, apiKeyRecord.apiKeyId))
      .execute()
      .catch((err) => logger.error('Failed to update API key lastUsedAt', err));

    logger.debug('API request authenticated', {
      workspaceId: apiKeyRecord.workspaceId,
      apiKeyId: apiKeyRecord.apiKeyId,
    });

    return {
      authenticated: true,
      context: {
        workspaceId: apiKeyRecord.workspaceId,
        workspaceName: apiKeyRecord.workspaceName,
        apiKeyId: apiKeyRecord.apiKeyId,
      },
    };
  } catch (error) {
    logger.error('API authentication error', error);
    return { authenticated: false, error: 'Authentication failed' };
  }
}
