"use client";

import { useState } from "react";
import { Wand2, Loader2, Copy, Check } from "lucide-react";

interface ContentSuggestion {
  headline: string;
  description: string;
  callToAction: string;
}

interface ContentAutoPopulatorProps {
  businessName: string;
  industry: string;
  template: string;
  onApplyContent: (content: ContentSuggestion) => void;
}

export default function ContentAutoPopulator({
  businessName,
  industry,
  template,
  onApplyContent,
}: ContentAutoPopulatorProps) {
  const [content, setContent] = useState<ContentSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          template, 
          businessInfo: { name: businessName, industry } 
        }),
      });

      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Wand2 className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Auto-Populator</h3>
            <p className="text-sm text-gray-600">Generate engaging content with AI</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Business:</strong> {businessName} | <strong>Industry:</strong> {industry} | <strong>Template:</strong> {template}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Content
            </>
          )}
        </button>

        {content && (
          <div className="space-y-4">
            {/* Headline */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Headline</label>
                <button
                  onClick={() => copyToClipboard(content.headline, "headline")}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedField === "headline" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-gray-900 font-medium">{content.headline}</p>
            </div>

            {/* Description */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <button
                  onClick={() => copyToClipboard(content.description, "description")}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedField === "description" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-gray-700">{content.description}</p>
            </div>

            {/* Call to Action */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Call to Action</label>
                <button
                  onClick={() => copyToClipboard(content.callToAction, "cta")}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedField === "cta" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-gray-900 font-semibold">{content.callToAction}</p>
            </div>

            <button
              onClick={() => onApplyContent(content)}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-medium"
            >
              Apply All Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
