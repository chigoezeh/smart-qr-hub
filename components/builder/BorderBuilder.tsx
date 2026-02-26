"use client";

import { useState } from "react";
import { BorderConfig } from "@/types/landing-page";
import { Minus, Plus, Link, Unlink } from "lucide-react";

interface BorderBuilderProps {
  value: BorderConfig;
  onChange: (value: BorderConfig) => void;
}

export default function BorderBuilder({ value, onChange }: BorderBuilderProps) {
  const [isLinked, setIsLinked] = useState(true);
  const [isRadiusLinked, setIsRadiusLinked] = useState(true);

  const borderStyles = [
    { value: "none", label: "None" },
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" },
  ] as const;

  const handleWidthChange = (side: "top" | "right" | "bottom" | "left", newValue: number) => {
    if (isLinked) {
      onChange({
        ...value,
        width: { top: newValue, right: newValue, bottom: newValue, left: newValue },
      });
    } else {
      onChange({
        ...value,
        width: { ...value.width, [side]: newValue },
      });
    }
  };

  const handleRadiusChange = (corner: "topLeft" | "topRight" | "bottomRight" | "bottomLeft", newValue: number) => {
    const currentRadius = value.radius || { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
    
    if (isRadiusLinked) {
      onChange({
        ...value,
        radius: { topLeft: newValue, topRight: newValue, bottomRight: newValue, bottomLeft: newValue },
      });
    } else {
      onChange({
        ...value,
        radius: { ...currentRadius, [corner]: newValue },
      });
    }
  };

  const presetValues = [0, 1, 2, 3, 4, 6, 8];
  const radiusPresets = [0, 4, 8, 12, 16, 20, 24, 32, 9999]; // 9999 = full

  return (
    <div className="space-y-6">
      {/* Border Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Border Style</label>
        <div className="grid grid-cols-5 gap-2">
          {borderStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => onChange({ ...value, style: style.value })}
              className={`px-3 py-2 text-xs rounded border-2 transition-colors ${
                value.style === style.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Border Width */}
      {value.style !== "none" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Border Width</label>
            <button
              onClick={() => setIsLinked(!isLinked)}
              className="p-1 hover:bg-gray-100 rounded"
              title={isLinked ? "Unlink sides" : "Link sides"}
            >
              {isLinked ? (
                <Link className="w-4 h-4 text-blue-600" />
              ) : (
                <Unlink className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Preset quick select */}
          <div className="flex gap-1 mb-3">
            {presetValues.map((preset) => (
              <button
                key={preset}
                onClick={() => handleWidthChange("top", preset)}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {preset}px
              </button>
            ))}
          </div>

          {isLinked ? (
            // Linked - Single control
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">All</span>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={value.width?.top || 0}
                  onChange={(e) => handleWidthChange("top", parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="32"
                  value={value.width?.top || 0}
                  onChange={(e) => handleWidthChange("top", parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-600">px</span>
              </div>
            </div>
          ) : (
            // Unlinked - Individual controls
            <div className="space-y-2">
              {(["top", "right", "bottom", "left"] as const).map((side) => (
                <div key={side} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-12 capitalize">{side}</span>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={value.width?.[side] || 0}
                    onChange={(e) => handleWidthChange(side, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="32"
                    value={value.width?.[side] || 0}
                    onChange={(e) => handleWidthChange(side, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-600">px</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Border Color */}
      {value.style !== "none" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value.color || "#e5e7eb"}
              onChange={(e) => onChange({ ...value, color: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={value.color || "#e5e7eb"}
              onChange={(e) => onChange({ ...value, color: e.target.value })}
              placeholder="#e5e7eb"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Border Radius */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Border Radius</label>
          <button
            onClick={() => setIsRadiusLinked(!isRadiusLinked)}
            className="p-1 hover:bg-gray-100 rounded"
            title={isRadiusLinked ? "Unlink corners" : "Link corners"}
          >
            {isRadiusLinked ? (
              <Link className="w-4 h-4 text-blue-600" />
            ) : (
              <Unlink className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Preset quick select */}
        <div className="flex gap-1 mb-3">
          {radiusPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleRadiusChange("topLeft", preset)}
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              {preset === 9999 ? "Full" : `${preset}px`}
            </button>
          ))}
        </div>

        {isRadiusLinked ? (
          // Linked - Single control
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-12">All</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={value.radius?.topLeft || 0}
                onChange={(e) => handleRadiusChange("topLeft", parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="200"
                value={value.radius?.topLeft || 0}
                onChange={(e) => handleRadiusChange("topLeft", parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">px</span>
            </div>
          </div>
        ) : (
          // Unlinked - Individual controls
          <div className="space-y-2">
            {(["topLeft", "topRight", "bottomRight", "bottomLeft"] as const).map((corner) => (
              <div key={corner} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">
                  {corner.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={value.radius?.[corner] || 0}
                  onChange={(e) => handleRadiusChange(corner, parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={value.radius?.[corner] || 0}
                  onChange={(e) => handleRadiusChange(corner, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-600">px</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Preview</p>
        <div
          className="w-full h-24 bg-white"
          style={{
            borderTopWidth: `${value.width?.top || 0}px`,
            borderRightWidth: `${value.width?.right || 0}px`,
            borderBottomWidth: `${value.width?.bottom || 0}px`,
            borderLeftWidth: `${value.width?.left || 0}px`,
            borderStyle: value.style,
            borderColor: value.color || "#e5e7eb",
            borderTopLeftRadius: `${value.radius?.topLeft || 0}px`,
            borderTopRightRadius: `${value.radius?.topRight || 0}px`,
            borderBottomRightRadius: `${value.radius?.bottomRight || 0}px`,
            borderBottomLeftRadius: `${value.radius?.bottomLeft || 0}px`,
          }}
        />
      </div>
    </div>
  );
}
