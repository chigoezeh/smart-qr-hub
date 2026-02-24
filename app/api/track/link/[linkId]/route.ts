import { db } from "@/db";
import { landingPageClicks } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;
    const linkIdNum = parseInt(linkId);

    if (isNaN(linkIdNum)) {
      return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
    }

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get IP for geo-location (using IP API)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";

    let country = null;
    let city = null;

    // Try to get geo data from IP
    if (ip !== "unknown" && ip !== "127.0.0.1") {
      try {
        const geoResponse = await fetch(
          `http://ip-api.com/json/${ip}?fields=country,city`
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          country = geoData.country || null;
          city = geoData.city || null;
        }
      } catch (error) {
        console.error("Geo lookup failed:", error);
        // Continue without geo data
      }
    }

    // Insert click record
    await db.insert(landingPageClicks).values({
      landingPageLinkId: linkIdNum,
      userAgent,
      country,
      city,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track click:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
