import { NextResponse } from "next/server";
import QRCode from "qrcode";
import crypto from "crypto";
import { db } from "../../../db"; 
import { qrCodes } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destinationUrl, title } = body;

    if (!destinationUrl) {
      return NextResponse.json({ error: "Destination URL is required" }, { status: 400 });
    }

    // 1. Generate a random 6-character short code (e.g., "a1b2c3")
    const shortCode = crypto.randomBytes(3).toString("hex");

    // 2. Save the Smart Link to PostgreSQL
    await db.insert(qrCodes).values({
      shortCode,
      destinationUrl,
      title: title || "Untitled Link",
    });

    // 3. Create the routing URL (what the QR code will actually scan)
    // For local testing, use your specific local IP address here.
    const routingUrl = `https://192.168.1.189:3000/q/${shortCode}`;

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
    console.error("QR Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}