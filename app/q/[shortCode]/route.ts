import { NextResponse } from "next/server";
import { db } from "../../../db";
import { qrCodes, scans } from "../../../db/schema";
import { eq, sql } from "drizzle-orm";
import { env } from "@/lib/env";
import { validateQRToken } from "@/actions/qr-security";
import { logger } from "@/lib/logger";

// Helper: Get client IP address
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

// Helper: Fetch geolocation data
async function getGeolocation(ip: string) {
  if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.")) {
    return null;
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      country: data.country_name || null,
      city: data.city || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };
  } catch (error) {
    console.error("Geolocation API error:", error);
    return null;
  }
}

// Helper: Parse UTM parameters from URL
function getUtmParams(url: string) {
  const urlObj = new URL(url);
  return {
    utmSource: urlObj.searchParams.get("utm_source") || null,
    utmMedium: urlObj.searchParams.get("utm_medium") || null,
    utmCampaign: urlObj.searchParams.get("utm_campaign") || null,
  };
}

// Helper: Get language from Accept-Language header
function getPreferredLanguage(request: Request): string | null {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return null;
  
  // Parse "en-US,en;q=0.9,es;q=0.8" -> "en"
  const primaryLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
  return primaryLang;
}

// Helper: Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Check if current time matches schedule
function matchesSchedule(schedules: any[]): string | null {
  if (!schedules || schedules.length === 0) return null;
  
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  
  for (const schedule of schedules) {
    if (!schedule.days || !schedule.startTime || !schedule.endTime) continue;
    
    // Check if today is in the schedule
    if (!schedule.days.includes(dayOfWeek)) continue;
    
    // Check if current time is within range
    if (currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
      return schedule.url;
    }
  }
  
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  try {
    const [qrRecord] = await db
      .select({ 
        id: qrCodes.id,
        contentType: qrCodes.contentType,
        contentData: qrCodes.contentData,
        url: qrCodes.destinationUrl, // Legacy
        iosUrl: qrCodes.iosUrl,
        androidUrl: qrCodes.androidUrl,
        schedules: qrCodes.schedules,
        languageRoutes: qrCodes.languageRoutes,
        workspaceId: qrCodes.workspaceId,
        // Security fields
        status: qrCodes.status,
        isPasswordProtected: qrCodes.isPasswordProtected,
        expiresAt: qrCodes.expiresAt,
        maxScans: qrCodes.maxScans,
        currentScans: qrCodes.currentScans,
        geofence: qrCodes.geofence,
        // Retargeting pixels
        facebookPixelId: qrCodes.facebookPixelId,
        googleTagManagerId: qrCodes.googleTagManagerId,
      })
      .from(qrCodes)
      .where(eq(qrCodes.shortCode, shortCode))
      .limit(1);

    if (!qrRecord) {
      return new NextResponse("QR Code not found", { status: 404 });
    }

    // SECURITY CHECKS (Phase 3)
    
    // 1. Status Check - QR must be active
    if (qrRecord.status !== "active") {
      return new NextResponse("This QR code has been paused or archived", { status: 403 });
    }
    
    // 2. Expiration Check
    if (qrRecord.expiresAt && new Date() > new Date(qrRecord.expiresAt)) {
      return new NextResponse("This QR code has expired", { status: 410 });
    }
    
    // Gather analytics data early for geofencing
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const os = /android/i.test(userAgent) ? "Android" : /iphone|ipad/i.test(userAgent) ? "iOS" : "Other";
    const deviceType = /mobile/i.test(userAgent) ? "Mobile" : "Desktop";
    const referrer = request.headers.get("referer") || null;
    const clientIp = getClientIp(request);
    const utmParams = getUtmParams(request.url);
    
    // 3. Geofencing Check (requires IP geolocation)
    if (qrRecord.geofence) {
      const geoData = await getGeolocation(clientIp);
      if (geoData && geoData.latitude && geoData.longitude) {
        const geofenceConfig = qrRecord.geofence as any;
        const distance = calculateDistance(
          geoData.latitude,
          geoData.longitude,
          geofenceConfig.latitude,
          geofenceConfig.longitude
        );
        
        // If user is outside the geofence radius
        if (distance > geofenceConfig.radiusKm) {
          return new NextResponse(
            `This QR code is only accessible within ${geofenceConfig.radiusKm}km of the specified location. You are ${distance.toFixed(1)}km away.`,
            { status: 403 }
          );
        }
      }
    }
    
    // 4. Password Protection Check
    if (qrRecord.isPasswordProtected) {
      // Check for verification token in query params
      const url = new URL(request.url);
      const token = url.searchParams.get("token");
      
      if (!token) {
        // Redirect to password verification page
        const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/verify/${shortCode}`;
        return NextResponse.redirect(verifyUrl, 302);
      }

      // Validate JWT token
      const isValidToken = await validateQRToken(token, shortCode);
      if (!isValidToken) {
        logger.warn("Invalid or expired token for password-protected QR code", { shortCode });
        const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/verify/${shortCode}?error=expired`;
        return NextResponse.redirect(verifyUrl, 302);
      }
      
      // Token is valid, proceed with access
    }
    
    // 5. Scan Limit Check
    if (qrRecord.maxScans && qrRecord.currentScans !== null && qrRecord.currentScans >= qrRecord.maxScans) {
      return new NextResponse("This QR code has reached its maximum scan limit", { status: 429 });
    }

    // For non-URL and non-landing-page types, this endpoint shouldn't be called
    // (QR codes encode content directly)
    if (qrRecord.contentType && qrRecord.contentType !== "url" && qrRecord.contentType !== "landing_page") {
      return new NextResponse(
        "This QR code contains static content (vCard, WiFi, etc.) and does not use redirects.",
        { status: 400 }
      );
    }
    
    // Fetch geolocation for analytics
    const geoData = await getGeolocation(clientIp);
    
    // Record scan with all analytics data
    await db.insert(scans).values({
      qrCodeId: qrRecord.id,
      os: os,
      deviceType: deviceType,
      userAgent: userAgent,
      referrer: referrer,
      country: geoData?.country,
      city: geoData?.city,
      latitude: geoData?.latitude,
      longitude: geoData?.longitude,
      utmSource: utmParams.utmSource,
      utmMedium: utmParams.utmMedium,
      utmCampaign: utmParams.utmCampaign,
    }).catch(console.error);
    
    // Increment scan counter
    await db
      .update(qrCodes)
      .set({ currentScans: sql`${qrCodes.currentScans} + 1` })
      .where(eq(qrCodes.id, qrRecord.id))
      .catch(console.error);

    // Get base URL from contentData or legacy destinationUrl
    let targetUrl = qrRecord.url; // Legacy field
    
    // Handle landing page content type
    if (qrRecord.contentType === "landing_page" && qrRecord.contentData && typeof qrRecord.contentData === "object") {
      const data = qrRecord.contentData as any;
      if (data.slug) {
        // Construct landing page URL
        targetUrl = `${env.NEXT_PUBLIC_APP_URL}/l/${data.slug}`;
        
        // Append UTM parameters if present
        if (data.utm) {
          const utmStr = data.utm.startsWith("?") ? data.utm : `?${data.utm}`;
          targetUrl += utmStr;
        }
      }
    } else if (qrRecord.contentData && typeof qrRecord.contentData === "object") {
      const data = qrRecord.contentData as any;
      if (data.url) {
        targetUrl = data.url;
      }
    }

    if (!targetUrl) {
      return new NextResponse("No destination URL configured", { status: 400 });
    }

    // Smart Routing Priority: Time > Language > OS > Default
    
    // 1. Time-based routing (highest priority)
    if (qrRecord.schedules) {
      const scheduleUrl = matchesSchedule(qrRecord.schedules as any[]);
      if (scheduleUrl) {
        return NextResponse.redirect(scheduleUrl, 302);
      }
    }
    
    // 2. Language-based routing
    if (qrRecord.languageRoutes) {
      const preferredLang = getPreferredLanguage(request);
      const langRoutes = qrRecord.languageRoutes as Record<string, string>;
      
      if (preferredLang && langRoutes[preferredLang]) {
        return NextResponse.redirect(langRoutes[preferredLang], 302);
      } else if (langRoutes.default) {
        return NextResponse.redirect(langRoutes.default, 302);
      }
    }
    
    // 3. OS-based routing
    if (os === "iOS" && qrRecord.iosUrl) {
      targetUrl = qrRecord.iosUrl;
    } else if (os === "Android" && qrRecord.androidUrl) {
      targetUrl = qrRecord.androidUrl;
    }

    // Check if tracking pixels are configured
    const hasPixels = qrRecord.facebookPixelId || qrRecord.googleTagManagerId;
    
    if (hasPixels) {
      // Redirect to pixel page for tracking, which will then redirect to target
      const pixelPageUrl = `${env.NEXT_PUBLIC_APP_URL}/pixel/${shortCode}?target=${encodeURIComponent(targetUrl)}`;
      return NextResponse.redirect(pixelPageUrl, 302);
    }

    // Direct redirect without pixel tracking
    return NextResponse.redirect(targetUrl, 302);

  } catch (error) {
    console.error("Redirect Engine Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}