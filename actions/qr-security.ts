"use server";

import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

// JWT secret (add to environment validation)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface TokenPayload {
  shortCode: string;
  timestamp: number;
}

// Verify QR code password and generate secure JWT token
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

    // Generate secure JWT token (valid for 5 minutes)
    const token = jwt.sign(
      {
        shortCode,
        timestamp: Date.now(),
      } as TokenPayload,
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    return {
      success: true,
      token,
    };
  } catch (error) {
    logger.error("Password verification error", error, { shortCode });
    return { success: false, error: "Verification failed" };
  }
}

// Validate JWT token for password-protected QR codes
export async function validateQRToken(token: string, shortCode: string): Promise<boolean> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Verify the token is for the correct QR code
    if (decoded.shortCode !== shortCode) {
      logger.warn("Token shortCode mismatch", { tokenShortCode: decoded.shortCode, expectedShortCode: shortCode });
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug("Token expired", { shortCode });
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid JWT token", { error, shortCode });
    } else {
      logger.error("Token validation error", error, { shortCode });
    }
    return false;
  }
}
