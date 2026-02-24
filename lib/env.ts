import { z } from 'zod';

/**
 * Environment Variable Validation Schema
 * 
 * This validates all environment variables at startup to prevent runtime crashes.
 * If validation fails, the app will not start and show clear error messages.
 */

const envSchema = z.object({
  // Database (Required)
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // Application URL (Required)
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),

  // Clerk Authentication (Required)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  
  // Clerk URLs (Required)
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/onboarding'),

  // Webhook Secrets (Required for production)
  WEBHOOK_SECRET: z.string().optional(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),

  // JWT Secret for password-protected QR codes
  JWT_SECRET: z.string().min(20, 'JWT_SECRET must be at least 20 characters').optional(),

  // Optional Services
  IPAPI_KEY: z.string().optional(),
  STABILITY_API_KEY: z.string().optional(),
  UPSTASH_REDIS_URL: z.string().url().optional().or(z.literal('')),
  UPSTASH_REDIS_TOKEN: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate and export typed environment variables
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error('Environment validation failed. Check the errors above.');
  }

  return parsed.data;
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe access to environment variables
export type Env = z.infer<typeof envSchema>;
