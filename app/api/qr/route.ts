import { NextResponse } from "next/server";
import QRCode from "qrcode";
import crypto from "crypto";
import { db } from "../../../db"; 
import { qrCodes } from "../../../db/schema";
import { auth } from "@clerk/nextjs/server";
import { db as database } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's workspace
    const membership = await database
      .select({ workspaceId: workspaceMembers.workspaceId })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, userId))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: "No workspace found" }, { status: 403 });
    }

    const workspaceId = membership[0].workspaceId;

    const body = await request.json();
    const { destinationUrl, title } = body;

    if (!destinationUrl) {
      return NextResponse.json({ error: "Destination URL is required" }, { status: 400 });
    }

    // 1. Generate a random 6-character short code (e.g., "a1b2c3")
    const shortCode = crypto.randomBytes(3).toString("hex");

    // 2. Save the Smart Link to PostgreSQL with workspace isolation
    await db.insert(qrCodes).values({
      workspaceId,
      shortCode,
      destinationUrl,
      title: title || "Untitled Link",
    });

    // 3. Create the routing URL using environment variable
    const baseUrl = env.NEXT_PUBLIC_APP_URL;
    const routingUrl = `${baseUrl}/q/${shortCode}`;

    // 4. Generate the QR Code image as a Base64 data string
    const qrImageBase64 = await QRCode.toDataURL(routingUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      success: true,
      shortCode,
      routingUrl,
      qrImage: qrImageBase64,
    });
    
  } catch (error) {
    logger.error("QR Generation Error", error);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}