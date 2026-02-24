"use server";

import { db } from "@/db";
import { landingPages, landingPageLinks } from "@/db/schema";
import { getCurrentWorkspace } from "@/lib/workspace";
import { isReservedSlug } from "@/lib/social-icons";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { eq } from "drizzle-orm";

export async function createLandingPage(formData: FormData) {
  try {
    const { workspace } = await getCurrentWorkspace();

    const type = formData.get("type") as string;
    const slug = formData.get("slug") as string;
    const theme = formData.get("theme") as string || "default";

    // Check if slug is reserved
    if (isReservedSlug(slug)) {
      return { success: false, error: "This slug is reserved and cannot be used. Please choose another." };
    }

    // Validate slug is unique
    const [existingPage] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.slug, slug))
      .limit(1);

    if (existingPage) {
      return { success: false, error: "This slug is already taken. Please choose another." };
    }

    // Type-specific fields
    const pageData: any = {
      workspaceId: workspace.id,
      slug,
      type,
      theme,
    };

    if (type === "vcard") {
      pageData.fullName = formData.get("fullName") as string;
      pageData.phone = formData.get("phone") as string;
      pageData.email = formData.get("email") as string;
      pageData.company = formData.get("company") as string;
      pageData.address = formData.get("address") as string;
      pageData.profilePhotoUrl = formData.get("profilePhotoUrl") as string;
    }

    // Custom CSS
    const customCss = formData.get("customCss") as string;
    if (customCss) {
      pageData.customCss = customCss;
    }

    // Insert landing page
    const [newPage] = await db
      .insert(landingPages)
      .values(pageData)
      .returning({ id: landingPages.id, slug: landingPages.slug });

    revalidatePath("/dashboard/pages");

    return {
      success: true,
      pageId: newPage.id,
      slug: newPage.slug,
    };
  } catch (error) {
    console.error("Failed to create landing page:", error);
    return { success: false, error: "Failed to create landing page" };
  }
}

export async function addPageLink(pageId: number, formData: FormData) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify page belongs to workspace
    const [page] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.id, pageId))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const icon = formData.get("icon") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string || "0");

    const [newLink] = await db
      .insert(landingPageLinks)
      .values({
        landingPageId: pageId,
        title,
        url,
        icon: icon || null,
        displayOrder,
      })
      .returning();

    revalidatePath(`/dashboard/pages/${pageId}/edit`);
    revalidatePath(`/l/${page.id}`);

    return { success: true, link: newLink };
  } catch (error) {
    console.error("Failed to add link:", error);
    return { success: false, error: "Failed to add link" };
  }
}

export async function updatePageLink(linkId: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const icon = formData.get("icon") as string;

    const [updatedLink] = await db
      .update(landingPageLinks)
      .set({
        title,
        url,
        icon: icon || null,
      })
      .where(eq(landingPageLinks.id, linkId))
      .returning();

    revalidatePath("/dashboard/pages");

    return { success: true, link: updatedLink };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

export async function deletePageLink(linkId: number) {
  try {
    await db.delete(landingPageLinks).where(eq(landingPageLinks.id, linkId));

    revalidatePath("/dashboard/pages");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link" };
  }
}

export async function reorderLinks(pageId: number, linkIds: number[]) {
  try {
    // Update display order for each link
    await Promise.all(
      linkIds.map((linkId, index) =>
        db
          .update(landingPageLinks)
          .set({ displayOrder: index })
          .where(eq(landingPageLinks.id, linkId))
      )
    );

    revalidatePath(`/dashboard/pages/${pageId}/edit`);

    return { success: true };
  } catch (error) {
    console.error("Failed to reorder links:", error);
    return { success: false, error: "Failed to reorder links" };
  }
}

export async function updateLandingPageCss(pageId: number, formData: FormData) {
  try {
    const { workspace } = await getCurrentWorkspace();

    // Verify page belongs to workspace
    const [page] = await db
      .select({ id: landingPages.id })
      .from(landingPages)
      .where(eq(landingPages.id, pageId))
      .limit(1);

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    const customCss = formData.get("customCss") as string;

    await db
      .update(landingPages)
      .set({ customCss: customCss || null })
      .where(eq(landingPages.id, pageId));

    revalidatePath(`/dashboard/pages/${pageId}/edit`);
    revalidatePath(`/l/${page.id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update custom CSS:", error);
    return { success: false, error: "Failed to update custom CSS" };
  }
}
