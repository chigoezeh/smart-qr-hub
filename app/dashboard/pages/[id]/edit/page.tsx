import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages, landingPageBlocks, workspaceMembers } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import PageEditor from "@/components/PageEditor";
import QRQuickCreate from "@/components/QRQuickCreate";
import { LandingPageBlock } from "@/types/landing-page";

export default async function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const pageId = parseInt(id);
  if (isNaN(pageId)) notFound();

  // Get user's workspace
  const membership = await db.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, user.id),
  });

  if (!membership) redirect("/onboarding");

  // Fetch landing page
  const page = await db.query.landingPages.findFirst({
    where: and(eq(landingPages.id, pageId), eq(landingPages.workspaceId, membership.workspaceId)),
  });

  if (!page) notFound();

  // Fetch blocks for this page
  const blocks = await db
    .select()
    .from(landingPageBlocks)
    .where(eq(landingPageBlocks.landingPageId, pageId))
    .orderBy(asc(landingPageBlocks.displayOrder));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/pages"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Edit Landing Page</h1>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
                    {page.template}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <span className="font-mono">/l/{page.slug}</span>
                  <span className="text-gray-300">•</span>
                  <span className="capitalize">{page.category}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <QRQuickCreate 
                pageSlug={page.slug}
                pageTitle={page.headerTitle || page.slug}
                pageId={pageId}
              />
              <Link
                href={`/l/${page.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageEditor 
          pageId={pageId} 
          initialBlocks={blocks as LandingPageBlock[]} 
          pageSlug={page.slug}
        />
      </div>
    </div>
  );
}
