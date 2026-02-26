"use client";

import { useState } from "react";
import { Pipette, Palette, Droplet } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  showGradient?: boolean;
  label?: string;
}

const PRESET_COLORS = [
  "#000000", "#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af",
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
];

const GRADIENT_PRESETS = [
  { name: "Sunset", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Twilight", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Purple", value: "linear-gradient(135deg, #a8caba 0%, #5d4157 100%)" },
];

export default function ColorPicker({ value, onChange, showGradient = true, label }: ColorPickerProps) {
  const [mode, setMode] = useState<"solid" | "gradient">("solid");
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientColor1, setGradientColor1] = useState("#667eea");
  const [gradientColor2, setGradientColor2] = useState("#764ba2");

  const isGradient = value.startsWith("linear-gradient") || value.startsWith("radial-gradient");

  const addToRecent = (color: string) => {
    setRecentColors((prev) => {
      const updated = [color, ...prev.filter((c) => c !== color)].slice(0, 10);
      return updated;
    });
  };

  const handleColorChange = (color: string) => {
    onChange(color);
    addToRecent(color);
  };

  const handleGradientChange = () => {
    const gradient = `linear-gradient(${gradientAngle}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
    onChange(gradient);
    addToRecent(gradient);
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {/* Mode Switcher */}
      {showGradient && (
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setMode("solid")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors ${
              mode === "solid" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Droplet className="w-4 h-4" />
            Solid
          </button>
          <button
            onClick={() => setMode("gradient")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors ${
              mode === "gradient"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Palette className="w-4 h-4" />
            Gradient
          </button>
        </div>
      )}

      {/* Solid Color Mode */}
      {mode === "solid" && (
        <div className="space-y-4">
          {/* Color Input */}
          <div className="flex gap-2">
            <input
              type="color"
              value={isGradient ? "#000000" : value}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={isGradient ? "" : value}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <p className="text-xs text-gray-600 mb-2">Preset Colors</p>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    value === color ? "border-blue-500 scale-110" : "border-gray-200 hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-2">Recent Colors</p>
              <div className="flex gap-2 flex-wrap">
                {recentColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(color)}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:scale-110 transition-transform"
                    style={{
                      background: color,
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gradient Mode */}
      {mode === "gradient" && showGradient && (
        <div className="space-y-4">
          {/* Gradient Direction */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Gradient Angle</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={gradientAngle}
                onChange={(e) => {
                  setGradientAngle(parseInt(e.target.value));
                  handleGradientChange();
                }}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => {
                  setGradientAngle(parseInt(e.target.value) || 0);
                  handleGradientChange();
                }}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">°</span>
            </div>
          </div>

          {/* Color Stops */}
          <div className="space-y-3">
            {/* Color 1 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Start Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={gradientColor1}
                  onChange={(e) => {
                    setGradientColor1(e.target.value);
                    handleGradientChange();
                  }}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={gradientColor1}
                  onChange={(e) => {
                    setGradientColor1(e.target.value);
                    handleGradientChange();
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Color 2 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">End Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={gradientColor2}
                  onChange={(e) => {
                    setGradientColor2(e.target.value);
                    handleGradientChange();
                  }}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={gradientColor2}
                  onChange={(e) => {
                    setGradientColor2(e.target.value);
                    handleGradientChange();
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Gradient Presets */}
          <div>
            <p className="text-xs text-gray-600 mb-2">Gradient Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleColorChange(preset.value)}
                  className="h-12 rounded border-2 border-gray-200 hover:border-blue-500 transition-all"
                  style={{ background: preset.value }}
                  title={preset.name}
                >
                  <span className="text-xs font-medium text-white drop-shadow-lg">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Preview</p>
        <div
          className="w-full h-24 rounded-lg border border-gray-200"
          style={{ background: value || "#ffffff" }}
        />
      </div>
    </div>
  );
}
