"use client";

import { useState } from "react";
import { Code, Eye, EyeOff, Sparkles } from "lucide-react";

interface AdvancedCSSEditorProps {
  blockId: number;
  initialCSS?: string;
  onSave: (css: string) => void;
}

export default function AdvancedCSSEditor({ blockId, initialCSS = "", onSave }: AdvancedCSSEditorProps) {
  const [css, setCSS] = useState(initialCSS);
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onSave(css);
  };

  const CSS_EXAMPLES = [
    {
      name: "Shadow & Rounded",
      code: `box-shadow: 0 10px 25px rgba(0,0,0,0.1);
border-radius: 16px;
transition: transform 0.3s ease;`,
    },
    {
      name: "Gradient Border",
      code: `border: 3px solid transparent;
background: linear-gradient(white, white) padding-box,
            linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
border-radius: 12px;`,
    },
    {
      name: "Glass Effect",
      code: `background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);`,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 flex items-center justify-between hover:from-purple-100 hover:to-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-gray-900">Advanced CSS Editor</span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
            Pro
          </span>
        </div>
        <Sparkles className={`w-5 h-5 text-purple-600 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* CSS Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Custom CSS for Block #{blockId}
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? "Hide" : "Show"} Preview
              </button>
            </div>

            <textarea
              value={css}
              onChange={(e) => setCSS(e.target.value)}
              placeholder="/* Add custom CSS here */
padding: 20px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;"
              rows={12}
              className="w-full px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-900 text-green-400"
              spellCheck={false}
            />
          </div>

          {/* Quick Templates */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
            <div className="grid grid-cols-3 gap-2">
              {CSS_EXAMPLES.map((example) => (
                <button
                  key={example.name}
                  onClick={() => setCSS(example.code)}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div
                className="p-4 border border-gray-300 rounded-lg bg-white"
                style={css ? parseCSS(css) : {}}
              >
                <p className="text-gray-700">This is how your block will look with the custom CSS applied.</p>
              </div>
            </div>
          )}

          {/* Helper Text */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <strong>Pro Tip:</strong> Use valid CSS properties only. Changes will be scoped to this specific block.
            Avoid using <code>!important</code> unless necessary.
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Apply CSS
            </button>
            <button
              onClick={() => {
                setCSS("");
                onSave("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to parse CSS string to React style object
function parseCSS(cssString: string): React.CSSProperties {
  const style: Record<string, string> = {};
  
  cssString.split(";").forEach((declaration) => {
    const [property, value] = declaration.split(":").map((s) => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      style[camelProperty] = value;
    }
  });

  return style as React.CSSProperties;
}
