"use client";

import { useState } from "react";
import { Grid3x3, Plus, Trash2, LayoutGrid } from "lucide-react";

interface GridTemplateToolProps {
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
  gridGap?: number;
  onChange: (config: {
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridAutoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
    gridGap?: number;
  }) => void;
}

/**
 * GridTemplateTool Component
 * 
 * Advanced CSS Grid configuration tool for complex layouts.
 * Allows users to:
 * - Define grid columns with flexible templates (fr, px, auto, %)
 * - Define grid rows with flexible templates
 * - Configure auto-flow behavior (row, column, dense)
 * - Set gap between grid items
 * - Use quick presets for common layouts
 * 
 * Features:
 * - Visual grid template builder
 * - Preset grid layouts (2-column, 3-column, etc.)
 * - Custom fr/px/auto/% unit support
 * - Gap slider with visual feedback
 * - Auto-flow direction controls
 * - Live CSS output display
 */
export default function GridTemplateTool({
  gridTemplateColumns = "1fr",
  gridTemplateRows,
  gridAutoFlow = "row",
  gridGap = 16,
  onChange,
}: GridTemplateToolProps) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [customColumns, setCustomColumns] = useState(gridTemplateColumns);
  const [customRows, setCustomRows] = useState(gridTemplateRows || "auto");

  // Column presets
  const applyColumnPreset = (preset: string) => {
    setCustomColumns(preset);
    onChange({
      gridTemplateColumns: preset,
      gridTemplateRows,
      gridAutoFlow,
      gridGap,
    });
  };

  // Handle manual column input
  const handleColumnsChange = (value: string) => {
    setCustomColumns(value);
    onChange({
      gridTemplateColumns: value,
      gridTemplateRows,
      gridAutoFlow,
      gridGap,
    });
  };

  // Handle manual row input
  const handleRowsChange = (value: string) => {
    setCustomRows(value);
    onChange({
      gridTemplateColumns,
      gridTemplateRows: value,
      gridAutoFlow,
      gridGap,
    });
  };

  // Handle auto-flow change
  const handleAutoFlowChange = (flow: "row" | "column" | "dense" | "row dense" | "column dense") => {
    onChange({
      gridTemplateColumns,
      gridTemplateRows,
      gridAutoFlow: flow,
      gridGap,
    });
  };

  // Handle gap change
  const handleGapChange = (gap: number) => {
    onChange({
      gridTemplateColumns,
      gridTemplateRows,
      gridAutoFlow,
      gridGap: gap,
    });
  };

  // Preset configurations
  const presets = [
    { name: "1 Column", value: "1fr" },
    { name: "2 Equal", value: "1fr 1fr" },
    { name: "3 Equal", value: "1fr 1fr 1fr" },
    { name: "4 Equal", value: "1fr 1fr 1fr 1fr" },
    { name: "Sidebar L", value: "250px 1fr" },
    { name: "Sidebar R", value: "1fr 250px" },
    { name: "60/40", value: "1.5fr 1fr" },
    { name: "40/60", value: "1fr 1.5fr" },
    { name: "Holy Grail", value: "200px 1fr 200px" },
    { name: "Auto Fit", value: "repeat(auto-fit, minmax(250px, 1fr))" },
    { name: "Auto Fill", value: "repeat(auto-fill, minmax(200px, 1fr))" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">
            CSS Grid Template
          </label>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("simple")}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              mode === "simple"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Simple
          </button>
          <button
            type="button"
            onClick={() => setMode("advanced")}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              mode === "advanced"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {mode === "simple" ? (
        <>
          {/* Column Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Column Layout Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyColumnPreset(preset.value)}
                  className={`px-2 py-2 text-xs font-medium border rounded-lg transition-all ${
                    customColumns === preset.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gap Control */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Gap (Grid Spacing)
              </label>
              <span className="text-xs font-mono text-gray-500">{gridGap}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="4"
              value={gridGap}
              onChange={(e) => handleGapChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>No Gap (0)</span>
              <span>Large (64px)</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Advanced: Custom Template Columns */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Grid Template Columns
            </label>
            <input
              type="text"
              value={customColumns}
              onChange={(e) => handleColumnsChange(e.target.value)}
              placeholder="e.g., 1fr 2fr 1fr"
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use: <code className="px-1 bg-gray-100 rounded">fr</code>,{" "}
              <code className="px-1 bg-gray-100 rounded">px</code>,{" "}
              <code className="px-1 bg-gray-100 rounded">%</code>,{" "}
              <code className="px-1 bg-gray-100 rounded">auto</code>,{" "}
              <code className="px-1 bg-gray-100 rounded">minmax()</code>,{" "}
              <code className="px-1 bg-gray-100 rounded">repeat()</code>
            </p>
          </div>

          {/* Advanced: Custom Template Rows */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Grid Template Rows
            </label>
            <input
              type="text"
              value={customRows}
              onChange={(e) => handleRowsChange(e.target.value)}
              placeholder="e.g., auto 1fr auto"
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave as <code className="px-1 bg-gray-100 rounded">auto</code> for automatic row sizing
            </p>
          </div>

          {/* Grid Auto Flow */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Grid Auto Flow
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAutoFlowChange("row")}
                className={`px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                  gridAutoFlow === "row"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                Row
              </button>
              <button
                type="button"
                onClick={() => handleAutoFlowChange("column")}
                className={`px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                  gridAutoFlow === "column"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                Column
              </button>
              <button
                type="button"
                onClick={() => handleAutoFlowChange("dense")}
                className={`px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                  gridAutoFlow === "dense"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                Dense
              </button>
              <button
                type="button"
                onClick={() => handleAutoFlowChange("row dense")}
                className={`px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                  gridAutoFlow === "row dense"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                Row Dense
              </button>
            </div>
          </div>

          {/* Gap Control */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Gap
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="128"
                  value={gridGap}
                  onChange={(e) => handleGapChange(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="4"
              value={gridGap}
              onChange={(e) => handleGapChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </>
      )}

      {/* CSS Output */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs font-medium text-gray-600 mb-1.5">CSS Output:</p>
        <div className="space-y-0.5 font-mono text-xs text-gray-700">
          <div>
            <span className="text-blue-600">display:</span> grid;
          </div>
          <div>
            <span className="text-blue-600">grid-template-columns:</span> {customColumns};
          </div>
          {customRows && customRows !== "auto" && (
            <div>
              <span className="text-blue-600">grid-template-rows:</span> {customRows};
            </div>
          )}
          {gridAutoFlow !== "row" && (
            <div>
              <span className="text-blue-600">grid-auto-flow:</span> {gridAutoFlow};
            </div>
          )}
          <div>
            <span className="text-blue-600">gap:</span> {gridGap}px;
          </div>
        </div>
      </div>

      {/* Visual Grid Preview */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <p className="text-xs font-medium text-gray-600 mb-3">Grid Preview:</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: customColumns || "1fr",
            gap: `${Math.min(gridGap, 16)}px`, // Cap at 16px for preview
            minHeight: "120px",
          }}
          className="border border-dashed border-gray-300 rounded p-2"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-xs text-blue-600 font-medium min-h-[40px]"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
