"use client";

import { Spacing } from "@/types/landing-page";
import { Lock, Unlock, Maximize2 } from "lucide-react";
import { useState } from "react";

interface SpacingEditorProps {
  label: string;
  value: Spacing;
  onChange: (spacing: Spacing) => void;
  unit?: "px" | "rem";
}

const PRESET_VALUES = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

export default function SpacingEditor({ label, value, onChange, unit = "px" }: SpacingEditorProps) {
  const [isLinked, setIsLinked] = useState(true);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const handleChange = (side: keyof Spacing, newValue: number) => {
    if (isLinked) {
      // Update all sides
      onChange({
        top: newValue,
        right: newValue,
        bottom: newValue,
        left: newValue,
      });
    } else {
      // Update only the specific side
      onChange({
        ...value,
        [side]: newValue,
      });
    }
  };

  const handlePresetClick = (presetValue: number) => {
    setActivePreset(presetValue);
    if (isLinked) {
      onChange({
        top: presetValue,
        right: presetValue,
        bottom: presetValue,
        left: presetValue,
      });
    }
  };

  const allSidesEqual = value.top === value.right && value.right === value.bottom && value.bottom === value.left;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          onClick={() => setIsLinked(!isLinked)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title={isLinked ? "Unlink sides" : "Link sides"}
        >
          {isLinked ? (
            <Lock className="w-4 h-4 text-blue-600" />
          ) : (
            <Unlock className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESET_VALUES.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
              (isLinked && allSidesEqual && value.top === preset) || activePreset === preset
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
            }`}
          >
            {preset}{unit}
          </button>
        ))}
      </div>

      {/* Visual Box Model */}
      <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-8">
        {/* Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2">
          <input
            type="number"
            value={value.top}
            onChange={(e) => handleChange("top", parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="200"
          />
          <div className="text-[10px] text-gray-500 text-center mt-0.5">top</div>
        </div>

        {/* Right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2">
          <input
            type="number"
            value={value.right}
            onChange={(e) => handleChange("right", parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="200"
          />
          <div className="text-[10px] text-gray-500 text-center mt-0.5">right</div>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2">
          <input
            type="number"
            value={value.bottom}
            onChange={(e) => handleChange("bottom", parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="200"
          />
          <div className="text-[10px] text-gray-500 text-center mt-0.5">bottom</div>
        </div>

        {/* Left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 ml-2">
          <input
            type="number"
            value={value.left}
            onChange={(e) => handleChange("left", parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="200"
          />
          <div className="text-[10px] text-gray-500 text-center mt-0.5">left</div>
        </div>

        {/* Center Content Box */}
        <div className="bg-blue-100 border-2 border-blue-300 rounded h-32 flex items-center justify-center">
          <div className="text-center">
            <Maximize2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xs text-blue-700 font-medium">Content</div>
          </div>
        </div>
      </div>

      {/* Detailed Sliders (Alternative View) */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <SpacingSide
          label="Top"
          value={value.top}
          onChange={(v) => handleChange("top", v)}
          unit={unit}
        />
        <SpacingSide
          label="Right"
          value={value.right}
          onChange={(v) => handleChange("right", v)}
          unit={unit}
        />
        <SpacingSide
          label="Bottom"
          value={value.bottom}
          onChange={(v) => handleChange("bottom", v)}
          unit={unit}
        />
        <SpacingSide
          label="Left"
          value={value.left}
          onChange={(v) => handleChange("left", v)}
          unit={unit}
        />
      </div>
    </div>
  );
}

function SpacingSide({ label, value, onChange, unit }: { label: string; value: number; onChange: (v: number) => void; unit: string }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-medium text-gray-600 w-16">{label}</label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min="0"
        max="200"
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex items-center gap-1 w-16">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-12 px-2 py-1 text-xs text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          max="200"
        />
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
  );
}
