"use client";

import { useState } from "react";
import { Search, Facebook, Twitter,  Image, FileText, Check } from "lucide-react";

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  keywords: string;
  canonicalUrl: string;
}

interface SEOOptimizerProps {
  initialData: Partial<SEOData>;
  pageSlug: string;
  onSave: (data: SEOData) => void;
}

export default function SEOOptimizer({ initialData, pageSlug, onSave }: SEOOptimizerProps) {
  const [data, setData] = useState<SEOData>({
    metaTitle: initialData.metaTitle || "",
    metaDescription: initialData.metaDescription || "",
    ogTitle: initialData.ogTitle || initialData.metaTitle || "",
    ogDescription: initialData.ogDescription || initialData.metaDescription || "",
    ogImage: initialData.ogImage || "",
    twitterCard: initialData.twitterCard || "summary_large_image",
    twitterTitle: initialData.twitterTitle || initialData.metaTitle || "",
    twitterDescription: initialData.twitterDescription || initialData.metaDescription || "",
    twitterImage: initialData.twitterImage || initialData.ogImage || "",
    keywords: initialData.keywords || "",
    canonicalUrl: initialData.canonicalUrl || `https://yourdomain.com/l/${pageSlug}`,
  });

  const [activeTab, setActiveTab] = useState<"general" | "social" | "advanced">("general");
  const [showPreview, setShowPreview] = useState(false);

  const update = (field: keyof SEOData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = () => {
    onSave(data);
  };

  const getTitleLength = () => data.metaTitle.length;
  const getDescriptionLength = () => data.metaDescription.length;
  const isTitleOptimal = () => getTitleLength() >= 50 && getTitleLength() <= 60;
  const isDescriptionOptimal = () => getDescriptionLength() >= 150 && getDescriptionLength() <= 160;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SEO Optimization</h3>
              <p className="text-sm text-gray-600">Optimize for search engines and social sharing</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save SEO
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "general"
              ? "text-green-600 border-b-2 border-green-600 bg-green-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          General SEO
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "social"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Facebook className="w-4 h-4 inline mr-2" />
          Social Media
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "advanced"
              ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Advanced
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* General SEO Tab */}
        {activeTab === "general" && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title *
                </label>
                <span className={`text-sm ${isTitleOptimal() ? "text-green-600" : "text-gray-500"}`}>
                  {getTitleLength()}/60 {isTitleOptimal() && "✓"}
                </span>
              </div>
              <input
                type="text"
                value={data.metaTitle}
                onChange={(e) => update("metaTitle", e.target.value)}
                placeholder="e.g., Best Pizza in NYC | Joe's Pizza"
                maxLength={70}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optimal: 50-60 characters. Shown in search results.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description *
                </label>
                <span className={`text-sm ${isDescriptionOptimal() ? "text-green-600" : "text-gray-500"}`}>
                  {getDescriptionLength()}/160 {isDescriptionOptimal() && "✓"}
                </span>
              </div>
              <textarea
                value={data.metaDescription}
                onChange={(e) => update("metaDescription", e.target.value)}
                placeholder="Discover authentic New York-style pizza at Joe's Pizza. Fresh ingredients, classic recipes, serving the community since 1975."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optimal: 150-160 characters. Appears below title in search results.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={data.keywords}
                onChange={(e) => update("keywords", e.target.value)}
                placeholder="pizza, new york, italian food, restaurant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </>
        )}

        {/* Social Media Tab */}
        {activeTab === "social" && (
          <>
            {/* OpenGraph */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                Facebook / Open Graph
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Title
                </label>
                <input
                  type="text"
                  value={data.ogTitle}
                  onChange={(e) => update("ogTitle", e.target.value)}
                  placeholder="Defaults to Meta Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Description
                </label>
                <textarea
                  value={data.ogDescription}
                  onChange={(e) => update("ogDescription", e.target.value)}
                  placeholder="Defaults to Meta Description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={data.ogImage}
                  onChange={(e) => update("ogImage", e.target.value)}
                  placeholder="https://example.com/image.jpg (1200x630px recommended)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {data.ogImage && (
                  <img
                    src={data.ogImage}
                    alt="OG Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                Twitter Card
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type
                </label>
                <select
                  value={data.twitterCard}
                  onChange={(e) => update("twitterCard", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Title
                </label>
                <input
                  type="text"
                  value={data.twitterTitle}
                  onChange={(e) => update("twitterTitle", e.target.value)}
                  placeholder="Defaults to OG Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        )}

        {/* Advanced Tab */}
        {activeTab === "advanced" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={data.canonicalUrl}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                placeholder="https://yourdomain.com/l/your-page"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Prevents duplicate content issues. Use your primary URL.
              </p>
            </div>

            {/* Structured Data Preview */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">JSON-LD Structured Data</h4>
              <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(
                    {
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      "name": data.metaTitle,
                      "description": data.metaDescription,
                      "url": data.canonicalUrl,
                      "image": data.ogImage,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This structured data helps search engines understand your content better.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
