"use server";

import { auth } from "@clerk/nextjs/server";
import { createWorkspace } from "@/lib/workspace";
import { redirect } from "next/navigation";

export async function createWorkspaceAction(name: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    if (!name.trim()) {
      return { success: false, error: "Workspace name is required" };
    }

    await createWorkspace(userId, name.trim());
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create workspace:", error);
    return { success: false, error: "Failed to create workspace" };
  }
}
