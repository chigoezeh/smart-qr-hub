"use client";

import { useState } from "react";
import { Zap, Loader2, ArrowRight } from "lucide-react";

interface AIMetaGeneratorProps {
  pageTitle: string;
  pageContent: string;
  onApplyMeta: (meta: { title: string; description: string; keywords: string[] }) => void;
}

export default function AIMetaGenerator({
  pageTitle,
  pageContent,
  onApplyMeta,
}: AIMetaGeneratorProps) {
  const [meta, setMeta] = useState<{ title: string; description: string; keywords: string[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageTitle, pageContent }),
      });

      const data = await response.json();
      setMeta(data);
    } catch (error) {
      console.error("Failed to generate meta:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI SEO Meta Generator</h3>
            <p className="text-sm text-gray-600">Generate optimized meta tags automatically</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating SEO Meta...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate SEO Meta Tags
            </>
          )}
        </button>

        {meta && (
          <div className="space-y-4">
            {/* Title */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Meta Title ({meta.title.length} chars)
              </label>
              <p className="text-gray-900 font-medium">{meta.title}</p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    meta.title.length >= 50 && meta.title.length <= 60
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${Math.min((meta.title.length / 60) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Meta Description ({meta.description.length} chars)
              </label>
              <p className="text-gray-700">{meta.description}</p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    meta.description.length >= 150 && meta.description.length <= 160
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${Math.min((meta.description.length / 160) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Keywords</label>
              <div className="flex flex-wrap gap-2">
                {meta.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onApplyMeta(meta)}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-medium flex items-center justify-center gap-2"
            >
              Apply Meta Tags
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
