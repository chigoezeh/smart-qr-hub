import { NextResponse } from "next/server";
import { db } from "../../../db";
import { qrCodes, scans } from "../../../db/schema";
import { eq } from "drizzle-orm";

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
        url: qrCodes.destinationUrl,
        iosUrl: qrCodes.iosUrl,
        androidUrl: qrCodes.androidUrl,
        schedules: qrCodes.schedules,
        languageRoutes: qrCodes.languageRoutes,
        workspaceId: qrCodes.workspaceId,
      })
      .from(qrCodes)
      .where(eq(qrCodes.shortCode, shortCode))
      .limit(1);

    if (!qrRecord) {
      return new NextResponse("QR Code not found", { status: 404 });
    }

    // Gather analytics data
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const os = /android/i.test(userAgent) ? "Android" : /iphone|ipad/i.test(userAgent) ? "iOS" : "Other";
    const deviceType = /mobile/i.test(userAgent) ? "Mobile" : "Desktop";
    const referrer = request.headers.get("referer") || null;
    const clientIp = getClientIp(request);
    const utmParams = getUtmParams(request.url);
    
    // Fetch geolocation (non-blocking)
    const geoData = await getGeolocation(clientIp);
    
    // Record scan with all analytics data
    db.insert(scans).values({
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

    // Smart Routing Priority: Time > Language > OS > Default
    let targetUrl = qrRecord.url;
    
    // 1. Time-based routing (highest priority)
    if (qrRecord.schedules) {
      const scheduleUrl = matchesSchedule(qrRecord.schedules as any[]);
      if (scheduleUrl) {
        targetUrl = scheduleUrl;
        return NextResponse.redirect(targetUrl, 302);
      }
    }
    
    // 2. Language-based routing
    if (qrRecord.languageRoutes) {
      const preferredLang = getPreferredLanguage(request);
      const langRoutes = qrRecord.languageRoutes as Record<string, string>;
      
      if (preferredLang && langRoutes[preferredLang]) {
        targetUrl = langRoutes[preferredLang];
        return NextResponse.redirect(targetUrl, 302);
      } else if (langRoutes.default) {
        targetUrl = langRoutes.default;
        return NextResponse.redirect(targetUrl, 302);
      }
    }
    
    // 3. OS-based routing
    if (os === "iOS" && qrRecord.iosUrl) {
      targetUrl = qrRecord.iosUrl;
    } else if (os === "Android" && qrRecord.androidUrl) {
      targetUrl = qrRecord.androidUrl;
    }

    return NextResponse.redirect(targetUrl, 302);

  } catch (error) {
    console.error("Redirect Engine Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}