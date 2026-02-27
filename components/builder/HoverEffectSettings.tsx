"use client";

import { useState } from "react";
import { HoverEffectConfig } from "@/types/landing-page";
import { MousePointer2, Sparkles } from "lucide-react";

interface HoverEffectSettingsProps {
  value: HoverEffectConfig;
  onChange: (value: HoverEffectConfig) => void;
}

/**
 * HoverEffectSettings Component
 * 
 * Provides UI controls for configuring hover state effects.
 * Uses CSS transitions for smooth, performant hover animations.
 * 
 * Features:
 * - Enable/disable toggle
 * - Effect presets (Lift, Grow, Glow, Tilt, Color Shift)
 * - Transition duration slider
 * - Easing curve selector
 * - Individual effect controls (transform, shadow, colors, opacity)
 * - Live preview description
 * - Custom hover state builder
 */
export default function HoverEffectSettings({
  value,
  onChange,
}: HoverEffectSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggle = (checked: boolean) => {
    onChange({
      ...value,
      enabled: checked,
    });
  };

  const handleDurationChange = (duration: number) => {
    onChange({
      ...value,
      duration,
    });
  };

  const handleEasingChange = (easing: string) => {
    onChange({
      ...value,
      easing,
    });
  };

  const applyPreset = (preset: "lift" | "grow" | "glow" | "tilt" | "colorShift") => {
    if (preset === "lift") {
      onChange({
        enabled: true,
        duration: 300,
        easing: "ease-out",
        transform: "translateY(-4px)",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      });
    } else if (preset === "grow") {
      onChange({
        enabled: true,
        duration: 300,
        easing: "ease-out",
        scale: 1.05,
      });
    } else if (preset === "glow") {
      onChange({
        enabled: true,
        duration: 300,
        easing: "ease-out",
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
      });
    } else if (preset === "tilt") {
      onChange({
        enabled: true,
        duration: 400,
        easing: "ease-out",
        transform: "perspective(1000px) rotateX(5deg) rotateY(5deg)",
      });
    } else if (preset === "colorShift") {
      onChange({
        enabled: true,
        duration: 300,
        easing: "ease-out",
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
      });
    }
  };

  const handleTransformChange = (transform: string) => {
    onChange({
      ...value,
      transform,
    });
  };

  const handleScaleChange = (scale: number) => {
    onChange({
      ...value,
      scale,
    });
  };

  const handleShadowChange = (boxShadow: string) => {
    onChange({
      ...value,
      boxShadow,
    });
  };

  const handleBackgroundColorChange = (backgroundColor: string) => {
    onChange({
      ...value,
      backgroundColor,
    });
  };

  const handleBorderColorChange = (borderColor: string) => {
    onChange({
      ...value,
      borderColor,
    });
  };

  const handleOpacityChange = (opacity: number) => {
    onChange({
      ...value,
      opacity,
    });
  };

  const getEffectDescription = () => {
    const effects: string[] = [];

    if (value.transform) {
      if (value.transform.includes("translateY(-")) effects.push("lifts up");
      else if (value.transform.includes("rotateX")) effects.push("tilts");
      else effects.push("transforms");
    }
    if (value.scale && value.scale !== 1) effects.push(`scales to ${value.scale}x`);
    if (value.boxShadow) effects.push("adds shadow");
    if (value.backgroundColor) effects.push("changes background");
    if (value.borderColor) effects.push("changes border");
    if (value.opacity && value.opacity !== 100) effects.push(`fades to ${value.opacity}%`);

    if (effects.length === 0) return "No hover effects configured.";

    return `On hover: ${effects.join(", ")}. Transition: ${value.duration}ms ${value.easing}.`;
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Hover Effects
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Change appearance when user hovers over element
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggle(!value.enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value.enabled ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value.enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {value.enabled && (
        <>
          {/* Effect Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Effect Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("lift")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Lift
              </button>
              <button
                type="button"
                onClick={() => applyPreset("grow")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Grow
              </button>
              <button
                type="button"
                onClick={() => applyPreset("glow")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Glow
              </button>
              <button
                type="button"
                onClick={() => applyPreset("tilt")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Tilt
              </button>
              <button
                type="button"
                onClick={() => applyPreset("colorShift")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors col-span-2"
              >
                Color Shift
              </button>
            </div>
          </div>

          {/* Transition Duration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Transition Duration
              </label>
              <span className="text-xs font-mono text-gray-500">{value.duration}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={value.duration}
              onChange={(e) => handleDurationChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Fast (100ms)</span>
              <span>Slow (1000ms)</span>
            </div>
          </div>

          {/* Scale Control */}
          {value.scale !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-600">
                  Scale
                </label>
                <span className="text-xs font-mono text-gray-500">{value.scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={value.scale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Shrink (0.8x)</span>
                <span>Grow (1.3x)</span>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showAdvanced ? "Hide" : "Show"} Advanced Settings
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {/* Easing */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Easing Curve
                </label>
                <select
                  value={value.easing}
                  onChange={(e) => handleEasingChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="linear">Linear</option>
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                </select>
              </div>

              {/* Transform */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Custom Transform
                </label>
                <input
                  type="text"
                  value={value.transform || ""}
                  onChange={(e) => handleTransformChange(e.target.value)}
                  placeholder="e.g., translateY(-4px) scale(1.05)"
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  CSS transform property
                </p>
              </div>

              {/* Box Shadow */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Box Shadow
                </label>
                <input
                  type="text"
                  value={value.boxShadow || ""}
                  onChange={(e) => handleShadowChange(e.target.value)}
                  placeholder="e.g., 0 10px 20px rgba(0,0,0,0.15)"
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={value.backgroundColor || "#ffffff"}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value.backgroundColor || ""}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Border Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={value.borderColor || "#e5e7eb"}
                    onChange={(e) => handleBorderColorChange(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value.borderColor || ""}
                    onChange={(e) => handleBorderColorChange(e.target.value)}
                    placeholder="#2563eb"
                    className="flex-1 px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Opacity */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Opacity
                  </label>
                  <span className="text-xs font-mono text-gray-500">
                    {value.opacity !== undefined ? value.opacity : 100}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={value.opacity !== undefined ? value.opacity : 100}
                  onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          )}

          {/* Preview Description */}
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="flex items-start gap-2">
              <MousePointer2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-800 font-medium mb-1">
                  Hover Effect Preview:
                </p>
                <p className="text-xs text-amber-700">
                  {getEffectDescription()}
                </p>
              </div>
            </div>
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
