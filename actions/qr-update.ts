"use server";

import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateQRCode(id: number, formData: FormData) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify ownership
    const [existing] = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.id, id), eq(qrCodes.workspaceId, workspace.id)))
      .limit(1);

    if (!existing) {
      return { success: false, error: "QR code not found or access denied" };
    }

    // Extract form data
    const title = formData.get("title") as string;
    const contentType = formData.get("contentType") as string;
    const contentDataRaw = formData.get("contentData") as string;
    const destinationUrl = formData.get("destinationUrl") as string | null;

    // OS-based routing
    const iosUrl = formData.get("iosUrl") as string | null;
    const androidUrl = formData.get("androidUrl") as string | null;

    // Time-based routing
    const schedulesRaw = formData.get("schedules") as string | null;
    const schedules = schedulesRaw ? JSON.parse(schedulesRaw) : null;

    // Language routing
    const languageRoutesRaw = formData.get("languageRoutes") as string | null;
    const languageRoutes = languageRoutesRaw ? JSON.parse(languageRoutesRaw) : null;

    // Security settings
    const isPasswordProtected = formData.get("isPasswordProtected") === "true";
    const passwordRaw = formData.get("password") as string | null;
    const expiresAtRaw = formData.get("expiresAt") as string | null;
    const maxScansRaw = formData.get("maxScans") as string | null;
    const geofenceRaw = formData.get("geofence") as string | null;

    // Parse content data
    let contentData = null;
    if (contentDataRaw) {
      try {
        contentData = JSON.parse(contentDataRaw);
      } catch (e) {
        return { success: false, error: "Invalid content data format" };
      }
    }

    // Prepare update object
    const updateData: any = {
      title,
      contentType,
      contentData,
      destinationUrl,
      iosUrl,
      androidUrl,
      schedules,
      languageRoutes,
      isPasswordProtected,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
      maxScans: maxScansRaw ? parseInt(maxScansRaw, 10) : null,
      geofence: geofenceRaw ? JSON.parse(geofenceRaw) : null,
    };

    // Hash password if provided and protection is enabled
    if (isPasswordProtected && passwordRaw) {
      updateData.passwordHash = await bcrypt.hash(passwordRaw, 10);
    } else if (!isPasswordProtected) {
      updateData.passwordHash = null;
    }

    // Update in database
    await db
      .update(qrCodes)
      .set(updateData)
      .where(eq(qrCodes.id, id));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/qr-codes");

    return { success: true };
  } catch (error) {
    console.error("Update QR code error:", error);
    return { success: false, error: "Failed to update QR code" };
  }
}

export async function deleteQRCode(id: number) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify ownership before deleting
    const [existing] = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.id, id), eq(qrCodes.workspaceId, workspace.id)))
      .limit(1);

    if (!existing) {
      return { success: false, error: "QR code not found or access denied" };
    }

    // Delete the QR code (cascade will handle scans)
    await db.delete(qrCodes).where(eq(qrCodes.id, id));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/qr-codes");

    return { success: true };
  } catch (error) {
    console.error("Delete QR code error:", error);
    return { success: false, error: "Failed to delete QR code" };
  }
}

export async function getQRCodeForEdit(id: number) {
  try {
    const { workspace } = await getCurrentWorkspace();

    const [qrCode] = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.id, id), eq(qrCodes.workspaceId, workspace.id)))
      .limit(1);

    if (!qrCode) {
      return { success: false, error: "QR code not found" };
    }

    return { 
      success: true, 
      data: {
        ...qrCode,
        // Don't send password hash to client
        passwordHash: undefined,
      }
    };
  } catch (error) {
    console.error("Get QR code error:", error);
    return { success: false, error: "Failed to fetch QR code" };
  }
}
