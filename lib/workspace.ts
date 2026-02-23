import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workspaces, workspaceMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Server-side utility to get the current user's active workspace
 * Throws an error if user is not authenticated or has no workspace
 */
export async function getCurrentWorkspace() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get the user's workspace membership
  const membership = await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, userId))
    .limit(1);

  if (membership.length === 0) {
    // User has no workspace - redirect to onboarding
    redirect("/onboarding");
  }

  return {
    workspace: membership[0].workspace,
    role: membership[0].role as "owner" | "admin" | "member" | "viewer",
  };
}

/**
 * Get workspace by ID with permission check
 */
export async function getWorkspaceById(workspaceId: number) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const membership = await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    )
    .limit(1);

  if (membership.length === 0) {
    throw new Error("Workspace not found or access denied");
  }

  return {
    workspace: membership[0].workspace,
    role: membership[0].role as "owner" | "admin" | "member" | "viewer",
  };
}

/**
 * Check if user has a specific role or higher in workspace
 */
export function hasPermission(
  userRole: "owner" | "admin" | "member" | "viewer",
  requiredRole: "owner" | "admin" | "member" | "viewer"
): boolean {
  const roleHierarchy = {
    owner: 4,
    admin: 3,
    member: 2,
    viewer: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Create a new workspace for a user
 */
export async function createWorkspace(userId: string, name: string) {
  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Create workspace
  const [newWorkspace] = await db
    .insert(workspaces)
    .values({
      name,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      plan: "free",
    })
    .returning();

  // Add user as owner
  await db.insert(workspaceMembers).values({
    workspaceId: newWorkspace.id,
    userId,
    role: "owner",
  });

  return newWorkspace;
}

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(userId: string) {
  const memberships = await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, userId));

  return memberships;
}
