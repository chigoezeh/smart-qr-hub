import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function GET() {
  try {
    const { workspace, role } = await getCurrentWorkspace();
    return NextResponse.json({ workspace, role });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 401 }
    );
  }
}
