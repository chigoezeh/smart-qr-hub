"use client";

import { useState } from "react";
import { TrendingUp, Loader2, RefreshCw } from "lucide-react";

interface ContentOptimizerProps {
  initialContent: string;
  contentType: "headline" | "description" | "cta";
  onOptimize: (optimizedContent: string) => void;
}

export default function ContentOptimizer({
  initialContent,
  contentType,
  onOptimize,
}: ContentOptimizerProps) {
  const [original, setOriginal] = useState(initialContent);
  const [optimized, setOptimized] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const labels = {
    headline: { title: "Headline", maxChars: 60 },
    description: { title: "Description", maxChars: 160 },
    cta: { title: "Call-to-Action", maxChars: 20 },
  };

  const handleOptimize = async () => {
    if (!original.trim()) return;

    setIsOptimizing(true);
    try {
      const response = await fetch("/api/ai/optimize-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: original, contentType }),
      });

      const data = await response.json();
      setOptimized(data.optimized);
    } catch (error) {
      console.error("Failed to optimize content:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        <div>
          <h4 className="font-semibold text-gray-900">{labels[contentType].title} Optimizer</h4>
          <p className="text-sm text-gray-600">Improve your {labels[contentType].title.toLowerCase()} with AI</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Original Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original ({original.length}/{labels[contentType].maxChars} chars)
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={contentType === "description" ? 3 : 2}
            maxLength={labels[contentType].maxChars}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Enter your ${labels[contentType].title.toLowerCase()}...`}
          />
        </div>

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={!original.trim() || isOptimizing}
          className="w-full px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Optimize with AI
            </>
          )}
        </button>

        {/* Optimized Content */}
        {optimized && (
          <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <label className="block text-sm font-semibold text-indigo-900 mb-2">
              ✨ Optimized Version ({optimized.length} chars)
            </label>
            <p className="text-gray-900 font-medium mb-3">{optimized}</p>
            <button
              onClick={() => onOptimize(optimized)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Use Optimized Version
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
