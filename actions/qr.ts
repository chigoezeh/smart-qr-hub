"use server";

import { db } from "../db";
import { qrCodes } from "../db/schema";
import crypto from "crypto";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function createSmartLink(formData: FormData) {
  // Get current user's workspace
  const { workspace } = await getCurrentWorkspace();

  const destinationUrl = formData.get("destinationUrl") as string;
  const title = formData.get("title") as string;
  const iosUrl = formData.get("iosUrl") as string;
  const androidUrl = formData.get("androidUrl") as string;
  const schedulesJson = formData.get("schedules") as string;
  const languageRoutesJson = formData.get("languageRoutes") as string;

  if (!destinationUrl) throw new Error("Destination URL is required");

  // Parse JSON fields if provided
  let schedules = null;
  let languageRoutes = null;

  try {
    if (schedulesJson && schedulesJson.trim()) {
      schedules = JSON.parse(schedulesJson);
    }
  } catch (e) {
    console.error("Invalid schedules JSON:", e);
  }

  try {
    if (languageRoutesJson && languageRoutesJson.trim()) {
      languageRoutes = JSON.parse(languageRoutesJson);
    }
  } catch (e) {
    console.error("Invalid language routes JSON:", e);
  }

  const shortCode = crypto.randomBytes(3).toString("hex");

  await db.insert(qrCodes).values({
    workspaceId: workspace.id,
    shortCode,
    destinationUrl,
    title: title || "Untitled Link",
    iosUrl: iosUrl || null,
    androidUrl: androidUrl || null,
    schedules: schedules as any,
    languageRoutes: languageRoutes as any,
  });

  // Use environment variable for base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const routingUrl = `${baseUrl}/q/${shortCode}`;

  const qrImageBase64 = await QRCode.toDataURL(routingUrl, {
    width: 1024,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });

  revalidatePath("/dashboard");

  return { success: true, shortCode, routingUrl, qrImageBase64 };
}