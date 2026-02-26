import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { landingPageViews, landingPages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      timeOnPage,
      blocksViewed,
      linksClicked,
      clickPositions,
      customEvents,
      didConvert,
      conversionType,
    } = body;

    // Get landing page by slug
    const page = await db.query.landingPages.findFirst({
      where: eq(landingPages.slug, slug),
      columns: { id: true },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Extract analytics data from request
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || request.headers.get("referrer") || "";
    
    // Get device type from user agent
    const deviceType = userAgent.match(/Mobile|Android|iPhone/i)
      ? "mobile"
      : userAgent.match(/Tablet|iPad/i)
      ? "tablet"
      : "desktop";

    // Get OS from user agent  
    let os = "Unknown";
    if (userAgent.match(/Windows/i)) os = "Windows";
    else if (userAgent.match(/Mac OS/i)) os = "macOS";
    else if (userAgent.match(/Linux/i)) os = "Linux";
    else if (userAgent.match(/Android/i)) os = "Android";
    else if (userAgent.match(/iOS|iPhone|iPad/i)) os = "iOS";

    // Get location from IP (using Vercel headers or geo property if available)
    const geo = (request as any).geo; // Vercel-specific property
    const country = geo?.country || request.headers.get("x-vercel-ip-country") || "";
    const city = geo?.city || request.headers.get("x-vercel-ip-city") || "";

    // Extract UTM parameters from URL
    const url = new URL(request.url);
    const utmSource = url.searchParams.get("utm_source") || undefined;
    const utmMedium = url.searchParams.get("utm_medium") || undefined;
    const utmCampaign = url.searchParams.get("utm_campaign") || undefined;

    // Insert view record
    await db.insert(landingPageViews).values({
      landingPageId: page.id,
      viewedAt: new Date(),
      os,
      deviceType,
      country,
      city,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      timeOnPage: timeOnPage || null,
      blocksViewed: blocksViewed || null,
      linksClicked: linksClicked || null,
      clickPositions: clickPositions || null,
      customEvents: customEvents || null,
      didConvert: didConvert || false,
      conversionType: conversionType || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
