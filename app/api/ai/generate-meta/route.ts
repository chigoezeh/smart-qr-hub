import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateMetaDescription } from "@/lib/ai-services";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { pageTitle, pageContent } = await req.json();

    if (!pageTitle) {
      return NextResponse.json(
        { error: "Page title is required" },
        { status: 400 }
      );
    }

    const meta = await generateMetaDescription(pageTitle, pageContent || "");
    return NextResponse.json(meta);
  } catch (error) {
    console.error("Meta generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate meta tags" },
      { status: 500 }
    );
  }
}
