"use server";

import { db } from "../db";
import { qrCodes } from "../db/schema";
import crypto from "crypto";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";

export async function createSmartLink(formData: FormData) {
  const destinationUrl = formData.get("destinationUrl") as string;
  const title = formData.get("title") as string;
  const iosUrl = formData.get("iosUrl") as string;
  const androidUrl = formData.get("androidUrl") as string;

  if (!destinationUrl) throw new Error("Destination URL is required");

  const shortCode = crypto.randomBytes(3).toString("hex");

  await db.insert(qrCodes).values({
    shortCode,
    destinationUrl,
    title: title || "Untitled Link",
    iosUrl: iosUrl || null,
    androidUrl: androidUrl || null,
  });

  const routingUrl = `https://192.168.1.189:3000/q/${shortCode}`;

  const qrImageBase64 = await QRCode.toDataURL(routingUrl, {
    width: 1024,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });

  revalidatePath("/dashboard");

  return { success: true, shortCode, routingUrl, qrImageBase64 };
}