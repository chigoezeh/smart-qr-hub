"use server";

import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { getCurrentWorkspace } from "@/lib/workspace";
import { revalidatePath } from "next/cache";

// Generate a new API key
export async function generateApiKey(name: string) {
  try {
    const { workspace } = await getCurrentWorkspace();

    if (!name || name.trim().length === 0) {
      return { success: false, error: "API key name is required" };
    }

    // Generate random API key (32 bytes = 64 hex characters)
    const apiKeyValue = `slh_${crypto.randomBytes(32).toString("hex")}`;
    
    // Hash the key for storage (never store plain keys)
    const keyHash = crypto.createHash("sha256").update(apiKeyValue).digest("hex");

    // Store in database
    const [newKey] = await db.insert(apiKeys).values({
      workspaceId: workspace.id,
      name: name.trim(),
      keyHash,
      isActive: true,
    }).returning({
      id: apiKeys.id,
      name: apiKeys.name,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
      isActive: apiKeys.isActive,
    });

    revalidatePath("/dashboard/settings");

    return {
      success: true,
      fullKey: apiKeyValue, // Only shown once!
      apiKey: {
        id: newKey.id,
        name: newKey.name,
        keyPreview: `${apiKeyValue.substring(0, 12)}...${apiKeyValue.substring(apiKeyValue.length - 4)}`,
        createdAt: newKey.createdAt,
        lastUsedAt: newKey.lastUsedAt,
        isActive: newKey.isActive,
      },
    };
  } catch (error) {
    console.error("Failed to generate API key:", error);
    return { success: false, error: "Failed to generate API key" };
  }
}

// Delete an API key
export async function deleteApiKey(keyId: number) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Delete key only if it belongs to the current workspace
    const result = await db
      .delete(apiKeys)
      .where(
        and(
          eq(apiKeys.id, keyId),
          eq(apiKeys.workspaceId, workspace.id)
        )
      );

    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return { success: false, error: "Failed to delete API key" };
  }
}

// Validate an API key (for API routes)
export async function validateApiKey(apiKeyValue: string) {
  try {
    if (!apiKeyValue || !apiKeyValue.startsWith("slh_")) {
      return { valid: false, error: "Invalid API key format" };
    }

    // Hash the provided key
    const keyHash = crypto.createHash("sha256").update(apiKeyValue).digest("hex");

    // Look up in database
    const [key] = await db
      .select({
        id: apiKeys.id,
        workspaceId: apiKeys.workspaceId,
        name: apiKeys.name,
        isActive: apiKeys.isActive,
      })
      .from(apiKeys)
      .where(eq(apiKeys.keyHash, keyHash))
      .limit(1);

    if (!key) {
      return { valid: false, error: "API key not found" };
    }

    if (!key.isActive) {
      return { valid: false, error: "API key is inactive" };
    }

    // Update last used timestamp (don't await - fire and forget)
    db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, key.id))
      .catch(console.error);

    return {
      valid: true,
      workspaceId: key.workspaceId,
      keyName: key.name,
    };
  } catch (error) {
    console.error("API key validation error:", error);
    return { valid: false, error: "Validation failed" };
  }
}
