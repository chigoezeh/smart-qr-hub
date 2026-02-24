import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { optimizeContent } from "@/lib/ai-services";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, contentType } = await req.json();

    if (!content || !contentType) {
      return NextResponse.json(
        { error: "Content and content type are required" },
        { status: 400 }
      );
    }

    const optimized = await optimizeContent(content, contentType);
    return NextResponse.json({ optimized });
  } catch (error) {
    console.error("Content optimization error:", error);
    return NextResponse.json(
      { error: "Failed to optimize content" },
      { status: 500 }
    );
  }
}
