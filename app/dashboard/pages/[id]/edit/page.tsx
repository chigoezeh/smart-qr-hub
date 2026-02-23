import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { landingPages, landingPageLinks, workspaceMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import LinkBuilder from "@/components/LinkBuilder";

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

  // Fetch links for this page
  const links = await db.query.landingPageLinks.findMany({
    where: eq(landingPageLinks.landingPageId, pageId),
    orderBy: (links, { asc }) => [asc(links.displayOrder)],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/pages"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Landing Page</h1>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
            </div>
            <Link
              href={`/l/${page.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Preview
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Page Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Page Details</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>{" "}
              <span className="font-medium text-gray-900 capitalize">{page.type}</span>
            </div>
            <div>
              <span className="text-gray-500">Theme:</span>{" "}
              <span className="font-medium text-gray-900 capitalize">{page.theme}</span>
            </div>
            {page.fullName && (
              <div>
                <span className="text-gray-500">Name:</span>{" "}
                <span className="font-medium text-gray-900">{page.fullName}</span>
              </div>
            )}
            {page.email && (
              <div>
                <span className="text-gray-500">Email:</span>{" "}
                <span className="font-medium text-gray-900">{page.email}</span>
              </div>
            )}
            {page.phone && (
              <div>
                <span className="text-gray-500">Phone:</span>{" "}
                <span className="font-medium text-gray-900">{page.phone}</span>
              </div>
            )}
            {page.company && (
              <div>
                <span className="text-gray-500">Company:</span>{" "}
                <span className="font-medium text-gray-900">{page.company}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              Public URL: <a href={`/l/${page.slug}`} target="_blank" className="text-blue-600 hover:underline">/l/{page.slug}</a>
            </p>
          </div>
        </div>

        {/* Link Builder (only for biolink and custom types) */}
        {(page.type === "biolink" || page.type === "custom") && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <LinkBuilder pageId={pageId} initialLinks={links} />
          </div>
        )}

        {/* vCard info */}
        {page.type === "vcard" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">vCard Page</h3>
            <p className="text-sm text-blue-700">
              This is a vCard page. Visitors can download your contact information directly.
              Links are not available for vCard pages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
