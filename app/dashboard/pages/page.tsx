import { db } from "@/db";
import { landingPages, landingPageLinks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Globe, User, Link2, Eye, MousePointerClick } from "lucide-react";

export default async function LandingPagesPage() {
  const { workspace } = await getCurrentWorkspace();

  // Fetch all landing pages for this workspace
  const pages = await db
    .select({
      id: landingPages.id,
      slug: landingPages.slug,
      type: landingPages.type,
      theme: landingPages.theme,
      fullName: landingPages.fullName,
      createdAt: landingPages.createdAt,
      updatedAt: landingPages.updatedAt,
    })
    .from(landingPages)
    .where(eq(landingPages.workspaceId, workspace.id))
    .orderBy(desc(landingPages.createdAt));

  // Get link counts for each page
  const linkCounts = await Promise.all(
    pages.map(async (page) => {
      const links = await db
        .select({ id: landingPageLinks.id })
        .from(landingPageLinks)
        .where(eq(landingPageLinks.landingPageId, page.id));
      return { pageId: page.id, count: links.length };
    })
  );

  const pagesWithCounts = pages.map((page) => ({
    ...page,
    linkCount: linkCounts.find((c) => c.pageId === page.id)?.count || 0,
  }));

  const typeIcons = {
    biolink: Link2,
    vcard: User,
    custom: Globe,
  };

  const typeLabels = {
    biolink: "Bio Link",
    vcard: "vCard",
    custom: "Custom",
  };

  const typeColors = {
    biolink: "bg-blue-100 text-blue-700 border-blue-200",
    vcard: "bg-purple-100 text-purple-700 border-purple-200",
    custom: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Landing Pages</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create bio-link pages, digital business cards, and custom landing pages
              </p>
            </div>
            <Link
              href="/dashboard/pages/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Page</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Pages</p>
            <p className="text-3xl font-bold text-gray-900">{pages.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Link2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Bio Links</p>
            <p className="text-3xl font-bold text-gray-900">
              {pages.filter((p) => p.type === "biolink").length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">vCards</p>
            <p className="text-3xl font-bold text-gray-900">
              {pages.filter((p) => p.type === "vcard").length}
            </p>
          </div>
        </div>

        {/* Pages List */}
        {pages.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No landing pages yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first bio-link page or digital business card to share your links in one beautiful place.
            </p>
            <Link
              href="/dashboard/pages/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagesWithCounts.map((page) => {
              const TypeIcon = typeIcons[page.type as keyof typeof typeIcons];
              const typeLabel = typeLabels[page.type as keyof typeof typeLabels];
              const typeColor = typeColors[page.type as keyof typeof typeColors];

              return (
                <div
                  key={page.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                          {page.type === "vcard" && page.fullName ? page.fullName : page.slug}
                        </h3>
                        <p className="text-xs text-gray-600 font-mono truncate">
                          /l/{page.slug}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColor} flex items-center gap-1.5`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Link2 className="w-4 h-4" />
                          Links
                        </span>
                        <span className="font-semibold text-gray-900">{page.linkCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <MousePointerClick className="w-4 h-4" />
                          Clicks
                        </span>
                        <span className="font-semibold text-gray-900">0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Theme</span>
                        <span className="font-semibold text-gray-900 capitalize">{page.theme}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/l/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </a>
                    <Link
                      href={`/dashboard/pages/${page.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
