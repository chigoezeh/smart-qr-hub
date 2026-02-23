import { NextResponse } from "next/server";
import { db } from "../../../db";
import { qrCodes, scans } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;

  try {
    const [qrRecord] = await db
      .select({ id: qrCodes.id, url: qrCodes.destinationUrl })
      .from(qrCodes)
      .where(eq(qrCodes.shortCode, shortCode))
      .limit(1);

    if (!qrRecord) {
      return new NextResponse("QR Code not found", { status: 404 });
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";
    const os = /android/i.test(userAgent) ? "Android" : /iphone|ipad/i.test(userAgent) ? "iOS" : "Other";
    const deviceType = /mobile/i.test(userAgent) ? "Mobile" : "Desktop";
    
    db.insert(scans).values({
      qrCodeId: qrRecord.id,
      os: os,
      deviceType: deviceType,
    }).catch(console.error);

    return NextResponse.redirect(qrRecord.url, 302);

  } catch (error) {
    console.error("Redirect Engine Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}