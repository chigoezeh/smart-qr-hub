"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages, workspaceMembers, pageVersions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PageStructure, PageElement } from "@/types/landing-page";
import { migrateBlocksToHierarchy, flattenHierarchyToBlocks } from "@/lib/page-builder-utils";

/**
 * Get page structure (hierarchical or migrated from flat blocks)
 */
export async function getPageStructure(pageId: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get page with workspace check
    const [page] = await db
      .select({
        id: landingPages.id,
        slug: landingPages.slug,
        pageStructure: landingPages.pageStructure,
        builderVersion: landingPages.builderVersion,
        workspaceId: landingPages.workspaceId,
      })
      .from(landingPages)
      .where(eq(landingPages.id, pageId))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    // Check workspace access
    const [member] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, page.workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (!member) {
      return { success: false, error: "Access denied" };
    }

    // If page has hierarchical structure, return it
    if (page.pageStructure && page.builderVersion === "v2") {
      return { 
        success: true, 
        structure: page.pageStructure as PageStructure,
        needsMigration: false,
      };
    }

    // Otherwise, migrate from flat blocks
    const { landingPageBlocks } = await import("@/db/schema");
    const blocks = await db
      .select()
      .from(landingPageBlocks)
      .where(eq(landingPageBlocks.landingPageId, pageId))
      .orderBy(landingPageBlocks.displayOrder);

    const structure = migrateBlocksToHierarchy(blocks as any);

    return { 
      success: true, 
      structure,
      needsMigration: true,
    };
  } catch (error) {
    console.error("Error getting page structure:", error);
    return { success: false, error: "Failed to load page structure" };
  }
}

/**
 * Save page structure (also saves to flat blocks for backward compatibility)
 */
export async function savePageStructure(pageId: number, structure: PageStructure) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Check access
    const [page] = await db
      .select({
        id: landingPages.id,
        workspaceId: landingPages.workspaceId,
      })
      .from(landingPages)
      .where(eq(landingPages.id, pageId))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    const [member] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, page.workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (!member) {
      return { success: false, error: "Access denied" };
    }

    // Update page structure and version
    await db
      .update(landingPages)
      .set({
        pageStructure: structure as any,
        builderVersion: "v2",
        updatedAt: new Date(),
      })
      .where(eq(landingPages.id, pageId));

    // Also update flat blocks for backward compatibility
    const { landingPageBlocks } = await import("@/db/schema");
    const flatBlocks = flattenHierarchyToBlocks(structure);

    // Delete existing blocks
    await db
      .delete(landingPageBlocks)
      .where(eq(landingPageBlocks.landingPageId, pageId));

    // Insert new blocks
    if (flatBlocks.length > 0) {
      const blocksToInsert = flatBlocks
        .filter((block) => block.blockType && block.content)
        .map((block) => ({
          landingPageId: pageId,
          blockType: block.blockType as string,
          content: block.content,
          title: block.title ?? null,
          displayOrder: block.displayOrder ?? 0,
          isVisible: block.isVisible ?? true,
          backgroundColor: block.backgroundColor ?? null,
          textColor: block.textColor ?? null,
          customStyles: block.customStyles ?? null,
        }));

      if (blocksToInsert.length > 0) {
        await db.insert(landingPageBlocks).values(blocksToInsert);
      }
    }

    revalidatePath(`/dashboard/pages/${pageId}/edit`);
    revalidatePath(`/l/[slug]`, "page");

    return { success: true };
  } catch (error) {
    console.error("Error saving page structure:", error);
    return { success: false, error: "Failed to save page structure" };
  }
}

/**
 * Create a version snapshot
 */
export async function createPageVersion(
  pageId: number,
  structure: PageStructure,
  description?: string
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get latest version number
    const [latestVersion] = await db
      .select({ versionNumber: pageVersions.versionNumber })
      .from(pageVersions)
      .where(eq(pageVersions.landingPageId, pageId))
      .orderBy(desc(pageVersions.versionNumber))
      .limit(1);

    const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    // Get page settings
    const [page] = await db
      .select()
      .from(landingPages)
      .where(eq(landingPages.id, pageId))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    // Create version
    await db.insert(pageVersions).values({
      landingPageId: pageId,
      versionNumber: nextVersionNumber,
      pageStructure: structure as any,
      settings: {
        theme: page.theme,
        colorPrimary: page.colorPrimary,
        colorSecondary: page.colorSecondary,
        fontFamily: page.fontFamily,
      } as any,
      changedBy: userId,
      changeDescription: description,
    });

    return { success: true, versionNumber: nextVersionNumber };
  } catch (error) {
    console.error("Error creating page version:", error);
    return { success: false, error: "Failed to create version" };
  }
}

/**
 * Get page version history
 */
export async function getPageVersions(pageId: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Check access
    const [page] = await db
      .select({ workspaceId: landingPages.workspaceId })
      .from(landingPages)
      .where(eq(landingPages.id, pageId))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    const [member] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, page.workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (!member) {
      return { success: false, error: "Access denied" };
    }

    // Get versions
    const versions = await db
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.landingPageId, pageId))
      .orderBy(desc(pageVersions.versionNumber))
      .limit(20);

    return {
      success: true,
      versions: versions.map((v) => ({
        id: v.id,
        versionNumber: v.versionNumber,
        changeDescription: v.changeDescription,
        changedBy: v.changedBy,
        createdAt: v.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error getting page versions:", error);
    return { success: false, error: "Failed to load versions" };
  }
}

/**
 * Restore a specific version
 */
export async function restorePageVersion(pageId: number, versionId: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get version
    const [version] = await db
      .select()
      .from(pageVersions)
      .where(
        and(
          eq(pageVersions.id, versionId),
          eq(pageVersions.landingPageId, pageId)
        )
      )
      .limit(1);

    if (!version) {
      return { success: false, error: "Version not found" };
    }

    // Save current state as new version first
    const currentResult = await getPageStructure(pageId);
    if (currentResult.success && currentResult.structure) {
      await createPageVersion(
        pageId,
        currentResult.structure,
        `Before restoring v${version.versionNumber}`
      );
    }

    // Restore version
    const structure = version.pageStructure as PageStructure;
    await savePageStructure(pageId, structure);

    if (version.settings) {
      const settings = version.settings as any;
      await db
        .update(landingPages)
        .set({
          theme: settings.theme,
          colorPrimary: settings.colorPrimary,
          colorSecondary: settings.colorSecondary,
          fontFamily: settings.fontFamily,
        })
        .where(eq(landingPages.id, pageId));
    }

    return { success: true };
  } catch (error) {
    console.error("Error restoring version:", error);
    return { success: false, error: "Failed to restore version" };
  }
}

/**
 * Auto-save page structure (called frequently)
 */
export async function autoSavePageStructure(pageId: number, structure: PageStructure) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Simple save without creating version
    await db
      .update(landingPages)
      .set({
        pageStructure: structure as any,
        builderVersion: "v2",
        updatedAt: new Date(),
      })
      .where(eq(landingPages.id, pageId));

    return { success: true };
  } catch (error) {
    console.error("Error auto-saving:", error);
    return { success: false, error: "Auto-save failed" };
  }
}
