"use server";

import { db } from "@/db";
import { landingPageBlocks, landingPages } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import { eq, and, asc } from "drizzle-orm";
import { BlockType, BlockContent } from "@/types/landing-page";

export async function createBlock(landingPageId: number, blockData: {
  blockType: BlockType;
  title?: string;
  content: BlockContent;
  displayOrder?: number;
}) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify page belongs to workspace
    const [page] = await db
      .select({ id: landingPages.id, slug: landingPages.slug })
      .from(landingPages)
      .where(and(
        eq(landingPages.id, landingPageId),
        eq(landingPages.workspaceId, workspace.id)
      ))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found or access denied" };
    }

    // Get max display order if not provided
    let displayOrder = blockData.displayOrder;
    if (displayOrder === undefined) {
      const blocks = await db
        .select({ displayOrder: landingPageBlocks.displayOrder })
        .from(landingPageBlocks)
        .where(eq(landingPageBlocks.landingPageId, landingPageId))
        .orderBy(asc(landingPageBlocks.displayOrder));
      
      displayOrder = blocks.length > 0 
        ? Math.max(...blocks.map(b => b.displayOrder)) + 1 
        : 0;
    }

    const [newBlock] = await db
      .insert(landingPageBlocks)
      .values({
        landingPageId,
        blockType: blockData.blockType,
        title: blockData.title || null,
        content: blockData.content as any,
        displayOrder,
        isVisible: true,
      })
      .returning();

    revalidatePath(`/dashboard/pages/${landingPageId}/edit`);
    revalidatePath(`/l/${page.slug}`);

    return { success: true, block: newBlock };
  } catch (error) {
    console.error("Failed to create block:", error);
    return { success: false, error: "Failed to create block" };
  }
}

export async function updateBlock(blockId: number, updates: {
  title?: string;
  content?: BlockContent;
  isVisible?: boolean;
  backgroundColor?: string;
  textColor?: string;
  customStyles?: any;
}) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify block belongs to user's workspace
    const [block] = await db
      .select({ 
        id: landingPageBlocks.id,
        landingPageId: landingPageBlocks.landingPageId,
        landingPages: { slug: landingPages.slug }
      })
      .from(landingPageBlocks)
      .leftJoin(landingPages, eq(landingPageBlocks.landingPageId, landingPages.id))
      .where(and(
        eq(landingPageBlocks.id, blockId),
        eq(landingPages.workspaceId, workspace.id)
      ))
      .limit(1) as any;

    if (!block) {
      return { success: false, error: "Block not found or access denied" };
    }

    const updateData: any = { updatedAt: new Date() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content as any;
    if (updates.isVisible !== undefined) updateData.isVisible = updates.isVisible;
    if (updates.backgroundColor !== undefined) updateData.backgroundColor = updates.backgroundColor;
    if (updates.textColor !== undefined) updateData.textColor = updates.textColor;
    if (updates.customStyles !== undefined) updateData.customStyles = updates.customStyles;
    if (updates.isVisible !== undefined) updateData.isVisible = updates.isVisible;
    if (updates.backgroundColor !== undefined) updateData.backgroundColor = updates.backgroundColor;
    if (updates.textColor !== undefined) updateData.textColor = updates.textColor;

    const [updatedBlock] = await db
      .update(landingPageBlocks)
      .set(updateData)
      .where(eq(landingPageBlocks.id, blockId))
      .returning();

    revalidatePath(`/dashboard/pages/${block.landingPageId}/edit`);
    revalidatePath(`/l/${block.landingPages.slug}`);

    return { success: true, block: updatedBlock };
  } catch (error) {
    console.error("Failed to update block:", error);
    return { success: false, error: "Failed to update block" };
  }
}

export async function deleteBlock(blockId: number) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify block belongs to user's workspace
    const [block] = await db
      .select({ 
        id: landingPageBlocks.id,
        landingPageId: landingPageBlocks.landingPageId,
        landingPages: { slug: landingPages.slug }
      })
      .from(landingPageBlocks)
      .leftJoin(landingPages, eq(landingPageBlocks.landingPageId, landingPages.id))
      .where(and(
        eq(landingPageBlocks.id, blockId),
        eq(landingPages.workspaceId, workspace.id)
      ))
      .limit(1) as any;

    if (!block) {
      return { success: false, error: "Block not found or access denied" };
    }

    await db.delete(landingPageBlocks).where(eq(landingPageBlocks.id, blockId));

    revalidatePath(`/dashboard/pages/${block.landingPageId}/edit`);
    revalidatePath(`/l/${block.landingPages.slug}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete block:", error);
    return { success: false, error: "Failed to delete block" };
  }
}

export async function reorderBlocks(landingPageId: number, blockIds: number[]) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify page belongs to workspace
    const [page] = await db
      .select({ id: landingPages.id, slug: landingPages.slug })
      .from(landingPages)
      .where(and(
        eq(landingPages.id, landingPageId),
        eq(landingPages.workspaceId, workspace.id)
      ))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found or access denied" };
    }

    // Update display order for each block
    await Promise.all(
      blockIds.map((blockId, index) =>
        db
          .update(landingPageBlocks)
          .set({ displayOrder: index, updatedAt: new Date() })
          .where(eq(landingPageBlocks.id, blockId))
      )
    );

    revalidatePath(`/dashboard/pages/${landingPageId}/edit`);
    revalidatePath(`/l/${page.slug}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to reorder blocks:", error);
    return { success: false, error: "Failed to reorder blocks" };
  }
}

export async function duplicateBlock(blockId: number) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Get original block
    const [originalBlock] = await db
      .select()
      .from(landingPageBlocks)
      .leftJoin(landingPages, eq(landingPageBlocks.landingPageId, landingPages.id))
      .where(and(
        eq(landingPageBlocks.id, blockId),
        eq(landingPages.workspaceId, workspace.id)
      ))
      .limit(1) as any;

    if (!originalBlock) {
      return { success: false, error: "Block not found or access denied" };
    }

    const block = originalBlock.landing_page_blocks;
    const page = originalBlock.landing_pages;

    // Create duplicate with incremented display order
    const [newBlock] = await db
      .insert(landingPageBlocks)
      .values({
        landingPageId: block.landingPageId,
        blockType: block.blockType,
        title: block.title ? `${block.title} (Copy)` : null,
        content: block.content,
        displayOrder: block.displayOrder + 1,
        isVisible: block.isVisible,
        backgroundColor: block.backgroundColor,
        textColor: block.textColor,
        customStyles: block.customStyles,
      })
      .returning();

    revalidatePath(`/dashboard/pages/${block.landingPageId}/edit`);
    revalidatePath(`/l/${page.slug}`);

    return { success: true, block: newBlock };
  } catch (error) {
    console.error("Failed to duplicate block:", error);
    return { success: false, error: "Failed to duplicate block" };
  }
}

export async function getPageBlocks(landingPageId: number) {
  try {
    const blocks = await db
      .select()
      .from(landingPageBlocks)
      .where(eq(landingPageBlocks.landingPageId, landingPageId))
      .orderBy(asc(landingPageBlocks.displayOrder));

    return { success: true, blocks };
  } catch (error) {
    console.error("Failed to get blocks:", error);
    return { success: false, error: "Failed to get blocks", blocks: [] };
  }
}
