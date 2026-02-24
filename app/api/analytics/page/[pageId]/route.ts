import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPageAnalytics } from "@/actions/analytics";
import { db } from "@/db";
import { landingPages, workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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

    // Get query parameters for date range
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30");
    const customStart = searchParams.get("start");
    const customEnd = searchParams.get("end");

    // Fetch analytics
    let result;
    if (customStart && customEnd) {
      // Custom date range - calculate days between
      const start = new Date(customStart);
      const end = new Date(customEnd);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      result = await getPageAnalytics(id, diffDays);
    } else {
      result = await getPageAnalytics(id, days);
    }

    if (result.error || !result.data) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
