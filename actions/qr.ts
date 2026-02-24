"use server";

import { db } from "../db";
import { qrCodes } from "../db/schema";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";
import { getCurrentWorkspace } from "@/lib/workspace";
import { QRContentType } from "@/types/qr-content";
import { encodeQRContent } from "@/lib/qr-encoder";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function createSmartLink(formData: FormData) {
  // Get current user's workspace
  const { workspace } = await getCurrentWorkspace();

  const title = formData.get("title") as string;
  const contentType = (formData.get("contentType") as QRContentType) || "url";
  const contentDataJson = formData.get("contentData") as string;
  
  // Legacy support for old URL-only QR codes
  const destinationUrl = formData.get("destinationUrl") as string;
  
  // Platform-specific routing (only for URL types)
  const iosUrl = formData.get("iosUrl") as string;
  const androidUrl = formData.get("androidUrl") as string;
  const schedulesJson = formData.get("schedules") as string;
  const languageRoutesJson = formData.get("languageRoutes") as string;
  
  // Security settings
  const isPasswordProtected = formData.get("isPasswordProtected") === "true";
  const passwordRaw = formData.get("password") as string;
  const expiresAtStr = formData.get("expiresAt") as string;
  const maxScansStr = formData.get("maxScans") as string;
  const geofenceJson = formData.get("geofence") as string;
  
  // Retargeting pixels
  const facebookPixelId = formData.get("facebookPixelId") as string;
  const googleTagManagerId = formData.get("googleTagManagerId") as string;

  // Parse content data
  let contentData: any = {};
  try {
    if (contentDataJson && contentDataJson.trim()) {
      contentData = JSON.parse(contentDataJson);
    } else if (destinationUrl) {
      // Legacy: if no contentData but destinationUrl provided, use it
      contentData = { url: destinationUrl };
    }
  } catch (e) {
    logger.error("Invalid content data JSON", e, { destinationUrl, contentType });
    throw new Error("Invalid content data format");
  }

  // Encode the content into QR-scannable format
  const qrContent = encodeQRContent(contentType, contentData);

  // Parse JSON fields if provided (smart routing for URL types)
  let schedules = null;
  let languageRoutes = null;

  try {
    if (schedulesJson && schedulesJson.trim()) {
      schedules = JSON.parse(schedulesJson);
    }
  } catch (e) {
    logger.warn("Invalid schedules JSON", { error: e, schedulesJson });
  }

  try {
    if (languageRoutesJson && languageRoutesJson.trim()) {
      languageRoutes = JSON.parse(languageRoutesJson);
    }
  } catch (e) {
    logger.warn("Invalid language routes JSON", { error: e, languageRoutesJson });
  }
  
  // Parse security settings
  let passwordHash = null;
  if (isPasswordProtected && passwordRaw) {
    passwordHash = await bcrypt.hash(passwordRaw, 10);
  }
  
  let expiresAt = null;
  if (expiresAtStr) {
    expiresAt = new Date(expiresAtStr);
  }
  
  let maxScans = null;
  if (maxScansStr) {
    maxScans = parseInt(maxScansStr, 10);
  }
  
  let geofence = null;
  try {
    if (geofenceJson && geofenceJson.trim()) {
      geofence = JSON.parse(geofenceJson);
    }
  } catch (e) {
    logger.warn("Invalid geofence JSON", { error: e, geofenceJson });
  }

  const shortCode = crypto.randomBytes(3).toString("hex");

  await db.insert(qrCodes).values({
    workspaceId: workspace.id,
    shortCode,
    title: title || "Untitled QR Code",
    contentType,
    contentData: contentData as any,
    // For URL types, also store in destinationUrl for backward compatibility
    destinationUrl: contentType === "url" && contentData.url ? contentData.url : null,
    iosUrl: contentType === "url" && iosUrl ? iosUrl : null,
    androidUrl: contentType === "url" && androidUrl ? androidUrl : null,
    schedules: contentType === "url" && schedules ? (schedules as any) : null,
    languageRoutes: contentType === "url" && languageRoutes ? (languageRoutes as any) : null,
    // Security settings
    isPasswordProtected,
    password: passwordHash,
    expiresAt,
    maxScans,
    geofence: geofence as any,
    // Retargeting pixels
    facebookPixelId: facebookPixelId || null,
    googleTagManagerId: googleTagManagerId || null,
  });

  // For URL types with smart routing, use our redirect URL
  // For static types (vcard, wifi, etc.), encode content directly
  const qrEncodedContent = contentType === "url" && (schedules || languageRoutes || iosUrl || androidUrl)
    ? `${env.NEXT_PUBLIC_APP_URL}/q/${shortCode}`
    : qrContent;

  const qrImageBase64 = await QRCode.toDataURL(qrEncodedContent, {
    width: 1024,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });

  revalidatePath("/dashboard");

  return { 
    success: true, 
    shortCode, 
    routingUrl: qrEncodedContent, 
    qrImageBase64,
    contentType 
  };
}