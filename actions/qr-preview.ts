"use server";

import QRCode from "qrcode";
import { QRContentType } from "@/types/qr-content";
import { encodeQRContent } from "@/lib/qr-encoder";

/**
 * Generate QR code preview WITHOUT saving to database
 * Used for real-time preview as user types
 */
export async function generateQRPreview(formData: FormData) {
  try {
    const contentType = (formData.get("contentType") as QRContentType) || "url";
    const contentDataJson = formData.get("contentData") as string;
    const schedulesJson = formData.get("schedules") as string;
    const languageRoutesJson = formData.get("languageRoutes") as string;
    
    // Parse content data
    let contentData: any = {};
    try {
      if (contentDataJson && contentDataJson.trim()) {
        contentData = JSON.parse(contentDataJson);
      }
    } catch (e) {
      return { success: false, error: "Invalid content data" };
    }

    // Parse smart routing rules
    let schedules = null;
    let languageRoutes = null;
    
    try {
      if (schedulesJson && schedulesJson.trim()) {
        schedules = JSON.parse(schedulesJson);
      }
    } catch (e) {
      // Ignore invalid schedules for preview
    }
    
    try {
      if (languageRoutesJson && languageRoutesJson.trim()) {
        languageRoutes = JSON.parse(languageRoutesJson);
      }
    } catch (e) {
      // Ignore invalid language routes for preview
    }

    // Encode content based on type
    const qrContent = encodeQRContent(contentType, contentData);
    
    if (!qrContent) {
      return { success: false, error: "Invalid content for QR code" };
    }

    // For URL types with smart routing, we'd use a redirect URL
    // But for PREVIEW only, we'll just show the base content
    // The actual short code will be generated on save
    const previewContent = qrContent;

    // Generate QR code image
    const qrImageBase64 = await QRCode.toDataURL(previewContent, {
      width: 1024,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    });

    return { 
      success: true, 
      qrImageBase64,
      contentType,
      // Note: No shortCode generated - this is preview only
      isPreview: true
    };
  } catch (error) {
    console.error("QR Preview generation error:", error);
    return { success: false, error: "Failed to generate preview" };
  }
}
