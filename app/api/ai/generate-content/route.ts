import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateContentForTemplate } from "@/lib/ai-services";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { template, businessInfo } = await req.json();

    if (!template || !businessInfo) {
      return NextResponse.json(
        { error: "Template and business info are required" },
        { status: 400 }
      );
    }

    const content = await generateContentForTemplate(template, businessInfo);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
