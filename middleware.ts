import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/qr(.*)',
  '/api/v1(.*)',
  '/onboarding(.*)',
]);

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/q/:path*', // QR code redirect routes must be public
  '/l/:path*', // Landing pages must be public
  '/api/webhooks(.*)', // Webhooks must be public
  '/api/track(.*)', // Tracking pixels must be public
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that are not explicitly public
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
