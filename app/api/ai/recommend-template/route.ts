import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { recommendTemplate } from "@/lib/ai-services";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { industry, goals } = await req.json();

    if (!industry || !goals || !Array.isArray(goals)) {
      return NextResponse.json(
        { error: "Industry and goals are required" },
        { status: 400 }
      );
    }

    const recommendation = await recommendTemplate(industry, goals);
    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("Template recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
}
