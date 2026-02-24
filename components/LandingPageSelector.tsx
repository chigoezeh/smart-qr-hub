"use client";

import { useState, useEffect } from "react";
import { FileText, Search, ExternalLink, Loader2 } from "lucide-react";

interface LandingPage {
  id: number;
  slug: string;
  headerTitle: string | null;
  category: string;
  template: string;
  isPublished: boolean;
  createdAt: Date;
}

interface LandingPageSelectorProps {
  selectedPageId: number | null;
  onSelectPage: (pageId: number, slug: string) => void;
}

export default function LandingPageSelector({ selectedPageId, onSelectPage }: LandingPageSelectorProps) {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/v1/pages");
      const data = await response.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error("Failed to fetch landing pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPages = pages.filter(page =>
    page.headerTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Landing Page</h3>
            <p className="text-sm text-gray-600">Choose a landing page to link to this QR code</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landing pages..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Pages List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery ? "No landing pages found" : "No landing pages created yet"}
            </p>
            <a
              href="/dashboard/pages/create"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Landing Page
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {filteredPages.map((page) => (
              <button
                key={page.id}
                onClick={() => onSelectPage(page.id, page.slug)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPageId === page.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {page.headerTitle || page.slug}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">/{page.slug}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                        {page.template}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                        {page.category}
                      </span>
                      {page.isPublished && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Published
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/l/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedPageId && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ Landing page selected! QR code will redirect to this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
