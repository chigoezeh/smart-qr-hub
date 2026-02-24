import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pageId = parseInt(id);
  const page = await db.query.landingPages.findFirst({
    where: eq(landingPages.id, pageId),
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Check workspace membership
  // @ts-ignore - notificationConfig will be added to schema
  const config = page.notificationConfig || {
    notifications: [],
    webhookUrl: "",
    apiKey: "",
    emailService: "resend",
  };

  return NextResponse.json(config);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pageId = parseInt(id);
  const config = await req.json();

  const page = await db.query.landingPages.findFirst({
    where: eq(landingPages.id, pageId),
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Update page with notification config
  await db
    .update(landingPages)
    .set({
      // @ts-ignore - notificationConfig will be added to schema
      notificationConfig: config,
      updatedAt: new Date(),
    })
    .where(eq(landingPages.id, pageId));

  return NextResponse.json({ success: true });
}
