"use client";

import { useState } from "react";
import { ParallaxConfig } from "@/types/landing-page";
import { MoveVertical, MoveHorizontal, Move, Eye, EyeOff } from "lucide-react";

interface ParallaxSettingsProps {
  value: ParallaxConfig;
  onChange: (value: ParallaxConfig) => void;
}

/**
 * ParallaxSettings Component
 * 
 * Provides UI controls for configuring parallax scrolling effects.
 * Allows users to:
 * - Enable/disable parallax effect
 * - Adjust scroll speed (-1 to 1, where negative = reverse direction)
 * - Configure scroll axis (vertical, horizontal, or both)
 * - Enable scale transformation during scroll
 * - Enable opacity fade during scroll
 * 
 * Features:
 * - Toggle switch for quick enable/disable
 * - Speed slider with visual feedback
 * - Axis selection with icons
 * - Effect toggles (scale, opacity)
 * - Preset buttons for common effects
 * - Live preview description
 */
export default function ParallaxSettings({
  value,
  onChange,
}: ParallaxSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggle = (checked: boolean) => {
    onChange({
      ...value,
      enabled: checked,
    });
  };

  const handleSpeedChange = (speed: number) => {
    onChange({
      ...value,
      speed,
    });
  };

  const handleAxisChange = (axis: "y" | "x" | "both") => {
    onChange({
      ...value,
      axis,
    });
  };

  const handleScaleToggle = () => {
    onChange({
      ...value,
      scale: !value.scale,
    });
  };

  const handleOpacityToggle = () => {
    onChange({
      ...value,
      opacity: !value.opacity,
    });
  };

  const applyPreset = (preset: "slow" | "fast" | "reverse" | "3d") => {
    if (preset === "slow") {
      onChange({
        enabled: true,
        speed: 0.3,
        axis: "y",
        scale: false,
        opacity: false,
      });
    } else if (preset === "fast") {
      onChange({
        enabled: true,
        speed: 0.8,
        axis: "y",
        scale: false,
        opacity: false,
      });
    } else if (preset === "reverse") {
      onChange({
        enabled: true,
        speed: -0.5,
        axis: "y",
        scale: false,
        opacity: false,
      });
    } else if (preset === "3d") {
      onChange({
        enabled: true,
        speed: 0.5,
        axis: "y",
        scale: true,
        opacity: true,
      });
    }
  };

  // Speed descriptions
  const getSpeedDescription = (speed: number) => {
    if (speed === 0) return "No parallax (normal scroll)";
    if (speed > 0 && speed <= 0.3) return "Slow drift";
    if (speed > 0.3 && speed <= 0.6) return "Moderate depth";
    if (speed > 0.6 && speed < 1) return "Fast movement";
    if (speed === 1) return "Scroll with content";
    if (speed < 0 && speed >= -0.3) return "Slight reverse";
    if (speed < -0.3 && speed >= -0.6) return "Moderate reverse";
    if (speed < -0.6) return "Fast reverse";
    return "Custom";
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Parallax Effect
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Element moves at different speed while scrolling
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
          {/* Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("slow")}
                className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Slow
              </button>
              <button
                type="button"
                onClick={() => applyPreset("fast")}
                className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Fast
              </button>
              <button
                type="button"
                onClick={() => applyPreset("reverse")}
                className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Reverse
              </button>
              <button
                type="button"
                onClick={() => applyPreset("3d")}
                className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                3D
              </button>
            </div>
          </div>

          {/* Speed Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Scroll Speed
              </label>
              <span className="text-xs font-mono text-gray-500">{value.speed.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={value.speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Reverse (-1)</span>
              <span>Normal (0)</span>
              <span>Forward (+1)</span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              {getSpeedDescription(value.speed)}
            </p>
          </div>

          {/* Scroll Axis */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Scroll Axis
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAxisChange("y")}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium border rounded-lg transition-all ${
                  value.axis === "y"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <MoveVertical className="w-4 h-4" />
                Vertical
              </button>
              <button
                type="button"
                onClick={() => handleAxisChange("x")}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium border rounded-lg transition-all ${
                  value.axis === "x"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <MoveHorizontal className="w-4 h-4" />
                Horizontal
              </button>
              <button
                type="button"
                onClick={() => handleAxisChange("both")}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium border rounded-lg transition-all ${
                  value.axis === "both"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <Move className="w-4 h-4" />
                Both
              </button>
            </div>
          </div>

          {/* Advanced Effects */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800 mb-2"
            >
              {showAdvanced ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              {showAdvanced ? "Hide" : "Show"} Advanced Effects
            </button>

            {showAdvanced && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {/* Scale Effect */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium text-gray-700">
                      Scale Effect
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Grow/shrink while scrolling
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleScaleToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      value.scale ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        value.scale ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Opacity Effect */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium text-gray-700">
                      Opacity Effect
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fade in/out while scrolling
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpacityToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      value.opacity ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        value.opacity ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview/Description */}
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
            <p className="text-xs text-purple-800 font-medium mb-1">
              Parallax Preview:
            </p>
            <p className="text-xs text-purple-700">
              Element scrolls{" "}
              {value.speed > 0
                ? `${(value.speed * 100).toFixed(0)}% slower`
                : value.speed < 0
                ? `in reverse at ${(Math.abs(value.speed) * 100).toFixed(0)}% speed`
                : "normally"}{" "}
              on the {value.axis === "y" ? "vertical" : value.axis === "x" ? "horizontal" : "both"} axis
              {value.scale && ", with scale effect"}
              {value.opacity && ", with opacity fade"}
              .
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
