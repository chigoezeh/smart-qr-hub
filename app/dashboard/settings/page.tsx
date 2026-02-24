import { getCurrentWorkspace } from "@/lib/workspace";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq } from "drizzle-orm";
import ApiKeyManager from "@/components/ApiKeyManager";

export default async function SettingsPage() {
  const { workspace } = await getCurrentWorkspace();

  // Fetch all API keys for this workspace
  const keys = await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyHash: apiKeys.keyHash,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt,
      isActive: apiKeys.isActive,
    })
    .from(apiKeys)
    .where(eq(apiKeys.workspaceId, workspace.id))
    .orderBy(apiKeys.createdAt);

  // Format keys for display (show preview only)
  const formattedKeys = keys.map(key => ({
    id: key.id,
    name: key.name,
    keyPreview: `slh_${"•".repeat(12)}...${key.keyHash.substring(key.keyHash.length - 4)}`,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
    isActive: key.isActive,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">API Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          {workspace.name} · API Keys & Developer Access
        </p>
      </div>

      {/* Content */}
      <ApiKeyManager initialKeys={formattedKeys} />
    </div>
  );
}
