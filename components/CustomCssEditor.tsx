"use client";

import { useState, useTransition } from "react";
import { Code } from "lucide-react";
import { updateLandingPageCss } from "@/actions/landing-page";
import { toast } from "sonner";

interface CustomCssEditorProps {
  pageId: number;
  initialCss: string | null;
}

export default function CustomCssEditor({ pageId, initialCss }: CustomCssEditorProps) {
  const [customCss, setCustomCss] = useState(initialCss || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("customCss", customCss);

      const result = await updateLandingPageCss(pageId, formData);

      if (result.success) {
        toast.success("Custom CSS updated successfully!");
      } else {
        toast.error(result.error || "Failed to update CSS");
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Code className="w-5 h-5" />
        Custom CSS
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSS Rules (Optional)
          </label>
          <textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder={`.landing-container {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}\n\n.link-button {\n  background: white;\n  color: #667eea;\n  font-weight: bold;\n  border-radius: 12px;\n}`}
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Tip: Target <code className="bg-gray-200 px-1 rounded">.landing-container</code> for the page background and{" "}
            <code className="bg-gray-200 px-1 rounded">.link-button</code> for individual links
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Saving..." : "Save Custom CSS"}
          </button>
          {customCss && (
            <button
              type="button"
              onClick={() => setCustomCss("")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear CSS
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
