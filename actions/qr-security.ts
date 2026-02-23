"use server";

import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Verify QR code password
export async function verifyQRPassword(shortCode: string, password: string) {
  try {
    const [qrCode] = await db
      .select({
        id: qrCodes.id,
        passwordHash: qrCodes.password,
        isPasswordProtected: qrCodes.isPasswordProtected,
      })
      .from(qrCodes)
      .where(eq(qrCodes.shortCode, shortCode))
      .limit(1);

    if (!qrCode) {
      return { success: false, error: "QR code not found" };
    }

    if (!qrCode.isPasswordProtected || !qrCode.passwordHash) {
      return { success: false, error: "QR code is not password protected" };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, qrCode.passwordHash);

    if (!isValid) {
      return { success: false, error: "Incorrect password" };
    }

    // Generate a verification token (valid for 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // In production, you'd store this token in a cache/database
    // For now, we'll use a simple session-based approach
    
    return {
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
    };
  } catch (error) {
    console.error("Password verification error:", error);
    return { success: false, error: "Verification failed" };
  }
}
