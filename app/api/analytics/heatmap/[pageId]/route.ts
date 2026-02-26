import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPageViews, landingPages, workspaceMembers } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await params;
    const id = parseInt(pageId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Get user's workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, userId),
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 403 });
    }

    // Verify page belongs to user's workspace
    const page = await db.query.landingPages.findFirst({
      where: and(
        eq(landingPages.id, id),
        eq(landingPages.workspaceId, membership.workspaceId)
      ),
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Get date range
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all views with click positions
    const views = await db
      .select({
        clickPositions: landingPageViews.clickPositions,
      })
      .from(landingPageViews)
      .where(
        and(
          eq(landingPageViews.landingPageId, id),
          gte(landingPageViews.viewedAt, startDate)
        )
      );

    // Aggregate click positions
    const clickMap = new Map<string, number>();
    
    views.forEach((view) => {
      if (view.clickPositions && Array.isArray(view.clickPositions)) {
        (view.clickPositions as Array<{ x: number; y: number; timestamp: number }>).forEach((click) => {
          // Round positions to create hotspot buckets (0.05 = 5% grid)
          const roundedX = Math.round(click.x * 20) / 20; // Round to nearest 5%
          const roundedY = Math.round(click.y * 20) / 20;
          const key = `${roundedX},${roundedY}`;
          
          clickMap.set(key, (clickMap.get(key) || 0) + 1);
        });
      }
    });

    // Convert to array format
    const clicks = Array.from(clickMap.entries()).map(([key, count]) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y, count };
    });

    // Sort by count descending and limit to top 50 hotspots
    clicks.sort((a, b) => b.count - a.count);
    const topClicks = clicks.slice(0, 50);

    return NextResponse.json({
      success: true,
      clicks: topClicks,
      total: clicks.length,
    });
  } catch (error) {
    console.error("Heatmap API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
