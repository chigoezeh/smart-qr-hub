"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface StickySettingsProps {
  enabled: boolean;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  onChange: (settings: {
    position?: "static" | "relative" | "sticky";
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
    zIndex?: number;
  }) => void;
}

/**
 * StickySettings Component
 * 
 * Provides UI controls for configuring sticky positioning behavior.
 * Allows users to:
 * - Enable/disable sticky positioning
 * - Set offset from viewport edges (top, right, bottom, left)
 * - Configure z-index for stacking order
 * - Preview sticky behavior description
 * 
 * Features:
 * - Toggle switch for quick enable/disable
 * - Number inputs for precise offset control
 * - Z-index slider with common presets
 * - Visual preview of sticky behavior
 * - Common presets (Header Sticky, Footer Sticky, Sidebar Sticky)
 */
export default function StickySettings({
  enabled,
  top,
  right,
  bottom,
  left,
  zIndex = 10,
  onChange,
}: StickySettingsProps) {
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // Enable sticky with default top offset
      onChange({
        position: "sticky",
        top: 0,
        zIndex: 10,
      });
    } else {
      // Disable sticky (return to relative)
      onChange({
        position: "relative",
        top: undefined,
        right: undefined,
        bottom: undefined,
        left: undefined,
        zIndex: undefined,
      });
    }
  };

  const handleOffsetChange = (edge: "top" | "right" | "bottom" | "left", value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    onChange({
      position: "sticky",
      top: edge === "top" ? numValue : top,
      right: edge === "right" ? numValue : right,
      bottom: edge === "bottom" ? numValue : bottom,
      left: edge === "left" ? numValue : left,
      zIndex,
    });
  };

  const handleZIndexChange = (value: number) => {
    onChange({
      position: "sticky",
      top,
      right,
      bottom,
      left,
      zIndex: value,
    });
  };

  const applyPreset = (preset: "header" | "footer" | "sidebar") => {
    if (preset === "header") {
      onChange({
        position: "sticky",
        top: 0,
        zIndex: 50,
      });
    } else if (preset === "footer") {
      onChange({
        position: "sticky",
        bottom: 0,
        zIndex: 50,
      });
    } else if (preset === "sidebar") {
      onChange({
        position: "sticky",
        top: 80, // Account for header
        zIndex: 40,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Sticky Position
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Element sticks to viewport while scrolling
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
          {/* Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("header")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Header
              </button>
              <button
                type="button"
                onClick={() => applyPreset("footer")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Footer
              </button>
              <button
                type="button"
                onClick={() => applyPreset("sidebar")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Sidebar
              </button>
            </div>
          </div>

          {/* Primary Offset Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Top Offset
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={top ?? ""}
                  onChange={(e) => handleOffsetChange("top", e.target.value)}
                  placeholder="auto"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  px
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Bottom Offset
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={bottom ?? ""}
                  onChange={(e) => handleOffsetChange("bottom", e.target.value)}
                  placeholder="auto"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  px
                </span>
              </div>
            </div>
          </div>

          {/* Advanced Controls Toggle */}
          <button
            type="button"
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800"
          >
            {isAdvanced ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
            {isAdvanced ? "Hide" : "Show"} Advanced Settings
          </button>

          {isAdvanced && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {/* Horizontal Offsets */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Left Offset
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={left ?? ""}
                      onChange={(e) => handleOffsetChange("left", e.target.value)}
                      placeholder="auto"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      px
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Right Offset
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={right ?? ""}
                      onChange={(e) => handleOffsetChange("right", e.target.value)}
                      placeholder="auto"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      px
                    </span>
                  </div>
                </div>
              </div>

              {/* Z-Index Control */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Z-Index (Stacking Order)
                  </label>
                  <span className="text-xs font-mono text-gray-500">{zIndex}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={zIndex}
                  onChange={(e) => handleZIndexChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Behind (0)</span>
                  <span>Front (100)</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview/Description */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">
              Sticky Behavior:
            </p>
            <p className="text-xs text-blue-700">
              {top !== undefined && top !== null && (
                <>Element will stick {top}px from the top of the viewport. </>
              )}
              {bottom !== undefined && bottom !== null && (
                <>Element will stick {bottom}px from the bottom of the viewport. </>
              )}
              {(top === undefined || top === null) &&
                (bottom === undefined || bottom === null) && (
                <>Element uses relative positioning (no sticky behavior). </>
              )}
            </p>
          </div>
        </>
      )}

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
