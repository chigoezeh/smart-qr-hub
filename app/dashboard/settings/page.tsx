import { getCurrentWorkspace } from "@/lib/workspace";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ApiKeyManager from "@/components/ApiKeyManager";
import { UserButton } from "@clerk/nextjs";
import { Settings, QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const workspace = await getCurrentWorkspace();
  
  if (!workspace) {
    redirect("/onboarding");
  }

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
    .where(eq(apiKeys.workspaceId, workspace.workspace.id))
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg"
              >
                <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-600" />
                  Workspace Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
                  {workspace.workspace.name} · API Keys & Developer Access
                </p>
              </div>
            </div>
            <div className="self-end sm:self-auto">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ApiKeyManager initialKeys={formattedKeys} />
      </div>
    </div>
  );
}
