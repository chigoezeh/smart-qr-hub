/**
 * Rate Limiting Middleware
 * 
 * Simple in-memory rate limiting for API requests.
 * For production, use Redis-based rate limiting (Upstash, Redis Cloud, etc.)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed per window
   */
  maxRequests: number;
  
  /**
   * Time window in seconds
   */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is allowed based on rate limits
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  // Get or create rate limit entry
  if (!store[identifier] || store[identifier].resetAt < now) {
    // Create new window
    store[identifier] = {
      count: 1,
      resetAt: now + windowMs,
    };
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt: store[identifier].resetAt,
    };
  }
  
  // Increment count
  store[identifier].count++;
  
  const allowed = store[identifier].count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - store[identifier].count);
  
  return {
    allowed,
    limit: config.maxRequests,
    remaining,
    resetAt: store[identifier].resetAt,
  };
}

/**
 * Get rate limit config based on workspace plan
 */
export function getRateLimitConfig(plan: string): RateLimitConfig {
  switch (plan) {
    case 'enterprise':
      return {
        maxRequests: 10000,
        windowSeconds: 60,
      };
    case 'pro':
      return {
        maxRequests: 1000,
        windowSeconds: 60,
      };
    case 'free':
    default:
      return {
        maxRequests: 100,
        windowSeconds: 60,
      };
  }
}

/**
 * Format rate limit headers for HTTP response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.resetAt / 1000).toString(),
  };
}
