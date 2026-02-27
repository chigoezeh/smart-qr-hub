"use client";

import { useState } from "react";
import { Maximize, Minimize, ArrowUpDown } from "lucide-react";

interface FlexboxAdvancedProps {
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  order?: number;
  alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  onChange: (config: {
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: string;
    order?: number;
    alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  }) => void;
}

/**
 * FlexboxAdvanced Component
 * 
 * Advanced flexbox configuration for fine-tuning individual flex items.
 * Allows users to:
 * - Set flex-grow (how much item grows relative to siblings)
 * - Set flex-shrink (how much item shrinks relative to siblings)
 * - Set flex-basis (initial size before growing/shrinking)
 * - Set order (visual order in flex container)
 * - Set align-self (override parent's align-items)
 * 
 * Features:
 * - Flex-grow slider with visual feedback (0-4)
 * - Flex-shrink slider (0-4)
 * - Flex-basis input (auto, px, %, fr)
 * - Order control with visual indicator
 * - Align-self selector with icons
 * - Preset buttons for common patterns
 * - Live CSS output display
 */
export default function FlexboxAdvanced({
  flexGrow = 0,
  flexShrink = 1,
  flexBasis = "auto",
  order = 0,
  alignSelf = "auto",
  onChange,
}: FlexboxAdvancedProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFlexGrowChange = (value: number) => {
    onChange({
      flexGrow: value,
      flexShrink,
      flexBasis,
      order,
      alignSelf,
    });
  };

  const handleFlexShrinkChange = (value: number) => {
    onChange({
      flexGrow,
      flexShrink: value,
      flexBasis,
      order,
      alignSelf,
    });
  };

  const handleFlexBasisChange = (value: string) => {
    onChange({
      flexGrow,
      flexShrink,
      flexBasis: value,
      order,
      alignSelf,
    });
  };

  const handleOrderChange = (value: number) => {
    onChange({
      flexGrow,
      flexShrink,
      flexBasis,
      order: value,
      alignSelf,
    });
  };

  const handleAlignSelfChange = (value: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch") => {
    onChange({
      flexGrow,
      flexShrink,
      flexBasis,
      order,
      alignSelf: value,
    });
  };

  const applyPreset = (preset: "default" | "grow" | "shrink" | "fixed") => {
    if (preset === "default") {
      onChange({
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        order: 0,
        alignSelf: "auto",
      });
    } else if (preset === "grow") {
      onChange({
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "0%",
        order,
        alignSelf,
      });
    } else if (preset === "shrink") {
      onChange({
        flexGrow: 0,
        flexShrink: 2,
        flexBasis: "auto",
        order,
        alignSelf,
      });
    } else if (preset === "fixed") {
      onChange({
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "auto",
        order,
        alignSelf,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Flexbox Properties
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Control how this item behaves in a flex container
          </p>
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => applyPreset("default")}
            className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => applyPreset("grow")}
            className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Grow
          </button>
          <button
            type="button"
            onClick={() => applyPreset("shrink")}
            className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Shrink
          </button>
          <button
            type="button"
            onClick={() => applyPreset("fixed")}
            className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Fixed
          </button>
        </div>
      </div>

      {/* Flex Grow */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-gray-600">
            Flex Grow
          </label>
          <span className="text-xs font-mono text-gray-500">{flexGrow}</span>
        </div>
        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={flexGrow}
          onChange={(e) => handleFlexGrowChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>No Growth (0)</span>
          <span>Max Growth (4)</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {flexGrow === 0
            ? "Will not grow beyond its base size"
            : `Will grow ${flexGrow}x relative to siblings with flex-grow: 1`}
        </p>
      </div>

      {/* Flex Shrink */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-gray-600">
            Flex Shrink
          </label>
          <span className="text-xs font-mono text-gray-500">{flexShrink}</span>
        </div>
        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={flexShrink}
          onChange={(e) => handleFlexShrinkChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>No Shrink (0)</span>
          <span>Max Shrink (4)</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {flexShrink === 0
            ? "Will not shrink below its base size"
            : `Will shrink ${flexShrink}x relative to siblings with flex-shrink: 1`}
        </p>
      </div>

      {/* Flex Basis */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Flex Basis
        </label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {["auto", "0%", "25%", "50%", "100%"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleFlexBasisChange(value)}
              className={`px-2 py-1.5 text-xs font-medium border rounded transition-all ${
                flexBasis === value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={flexBasis}
          onChange={(e) => handleFlexBasisChange(e.target.value)}
          placeholder="e.g., auto, 200px, 50%"
          className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">
          Initial size before growing/shrinking. Use{" "}
          <code className="px-1 bg-gray-100 rounded">auto</code>,{" "}
          <code className="px-1 bg-gray-100 rounded">px</code>, or{" "}
          <code className="px-1 bg-gray-100 rounded">%</code>
        </p>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800"
      >
        {showAdvanced ? (
          <Minimize className="w-3.5 h-3.5" />
        ) : (
          <Maximize className="w-3.5 h-3.5" />
        )}
        {showAdvanced ? "Hide" : "Show"} Advanced Settings
      </button>

      {showAdvanced && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          {/* Order */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Order (Visual Position)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="-10"
                  max="10"
                  value={order}
                  onChange={(e) => handleOrderChange(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Lower values appear first. Default is 0. Range: -10 to 10.
            </p>
          </div>

          {/* Align Self */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Align Self
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "auto", label: "Auto" },
                { value: "flex-start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "flex-end", label: "End" },
                { value: "stretch", label: "Stretch" },
                { value: "baseline", label: "Baseline" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAlignSelfChange(option.value as any)}
                  className={`px-2 py-2 text-xs font-medium border rounded-lg transition-all ${
                    alignSelf === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Override the parent container's align-items for this element
            </p>
          </div>
        </div>
      )}

      {/* CSS Output */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs font-medium text-gray-600 mb-1.5">CSS Output:</p>
        <div className="space-y-0.5 font-mono text-xs text-gray-700">
          {flexGrow !== 0 && (
            <div>
              <span className="text-blue-600">flex-grow:</span> {flexGrow};
            </div>
          )}
          {flexShrink !== 1 && (
            <div>
              <span className="text-blue-600">flex-shrink:</span> {flexShrink};
            </div>
          )}
          {flexBasis !== "auto" && (
            <div>
              <span className="text-blue-600">flex-basis:</span> {flexBasis};
            </div>
          )}
          {order !== 0 && (
            <div>
              <span className="text-blue-600">order:</span> {order};
            </div>
          )}
          {alignSelf !== "auto" && (
            <div>
              <span className="text-blue-600">align-self:</span> {alignSelf};
            </div>
          )}
          {flexGrow === 0 && flexShrink === 1 && flexBasis === "auto" && order === 0 && alignSelf === "auto" && (
            <div className="text-gray-500 italic">No custom flex properties set</div>
          )}
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
