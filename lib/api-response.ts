import { NextResponse } from 'next/server';

/**
 * Standardized API Response Helper
 * 
 * Provides consistent response format across all API endpoints
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Success response helper
 */
export function apiSuccess<T>(data: T, meta?: ApiSuccessResponse['meta'], status = 200) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    { success: true, data, ...(meta && { meta }) },
    { status }
  );
}

/**
 * Error response helpers
 */
export function apiError(
  code: string,
  message: string,
  details?: any,
  status = 400
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

export function apiBadRequest(message: string, details?: any) {
  return apiError('BAD_REQUEST', message, details, 400);
}

export function apiUnauthorized(message = 'Invalid or missing API key') {
  return apiError('UNAUTHORIZED', message, undefined, 401);
}

export function apiForbidden(message = 'Access forbidden') {
  return apiError('FORBIDDEN', message, undefined, 403);
}

export function apiNotFound(resource = 'Resource') {
  return apiError('NOT_FOUND', `${resource} not found`, undefined, 404);
}

export function apiTooManyRequests(message = 'Rate limit exceeded') {
  return apiError('RATE_LIMIT_EXCEEDED', message, undefined, 429);
}

export function apiInternalError(message = 'Internal server error') {
  return apiError('INTERNAL_ERROR', message, undefined, 500);
}
