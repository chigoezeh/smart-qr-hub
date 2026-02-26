import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { suggestImageKeywords } from "@/lib/ai-services";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessName, industry, context } = await req.json();

    if (!businessName || !industry) {
      return NextResponse.json(
        { error: "Business name and industry are required" },
        { status: 400 }
      );
    }

    const keywords = await suggestImageKeywords(businessName, industry, context || "");
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("Image keyword suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to suggest keywords" },
      { status: 500 }
    );
  }
}
