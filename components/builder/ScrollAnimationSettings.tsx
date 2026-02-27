"use client";

import { useState } from "react";
import { ScrollAnimationConfig } from "@/types/landing-page";
import { Zap, Play, Eye } from "lucide-react";

interface ScrollAnimationSettingsProps {
  value: ScrollAnimationConfig;
  onChange: (value: ScrollAnimationConfig) => void;
}

/**
 * ScrollAnimationSettings Component
 * 
 * Provides UI controls for configuring scroll-triggered animations.
 * Uses IntersectionObserver for performance-optimized scroll detection.
 * 
 * Features:
 * - Enable/disable toggle
 * - Animation type selector (fade, slide, zoom, rotate)
 * - Direction controls for slide animations
 * - Duration slider (100-2000ms)
 * - Delay slider (0-2000ms)
 * - Easing curve selector
 * - Trigger point (viewport intersection %)
 * - Animation presets
 * - Live preview description
 */
export default function ScrollAnimationSettings({
  value,
  onChange,
}: ScrollAnimationSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggle = (checked: boolean) => {
    onChange({
      ...value,
      enabled: checked,
    });
  };

  const handleAnimationTypeChange = (type: "fade" | "slide" | "zoom" | "rotate") => {
    onChange({
      ...value,
      type,
    });
  };

  const handleDirectionChange = (direction: "up" | "down" | "left" | "right") => {
    onChange({
      ...value,
      slideDirection: direction,
    });
  };

  const handleDurationChange = (duration: number) => {
    onChange({
      ...value,
      duration,
    });
  };

  const handleDelayChange = (delay: number) => {
    onChange({
      ...value,
      delay,
    });
  };

  const handleEasingChange = (easing: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out") => {
    onChange({
      ...value,
      easing,
    });
  };

  const handleTriggerEventChange = (triggerEvent: "enter" | "exit" | "enter-exit") => {
    onChange({
      ...value,
      triggerEvent,
    });
  };

  const handleTriggerPointChange = (point: number) => {
    onChange({
      ...value,
      triggerPoint: point,
    });
  };

  const applyPreset = (preset: "fadeIn" | "slideUp" | "slideUpFade" | "zoomIn" | "rotateIn") => {
    if (preset === "fadeIn") {
      onChange({
        enabled: true,
        type: "fade",
        duration: 800,
        delay: 0,
        easing: "ease-out",
        triggerPoint: 20,
        triggerEvent: "enter",
      });
    } else if (preset === "slideUp") {
      onChange({
        enabled: true,
        type: "slide",
        slideDirection: "up",
        duration: 800,
        delay: 0,
        easing: "ease-out",
        triggerPoint: 20,
        triggerEvent: "enter",
      });
    } else if (preset === "slideUpFade") {
      onChange({
        enabled: true,
        type: "slide",
        slideDirection: "up",
        duration: 800,
        delay: 0,
        easing: "ease-out",
        triggerPoint: 20,
        triggerEvent: "enter",
      });
    } else if (preset === "zoomIn") {
      onChange({
        enabled: true,
        type: "zoom",
        duration: 600,
        delay: 0,
        easing: "ease-out",
        triggerPoint: 20,
        triggerEvent: "enter",
      });
    } else if (preset === "rotateIn") {
      onChange({
        enabled: true,
        type: "rotate",
        duration: 800,
        delay: 0,
        easing: "ease-out",
        triggerPoint: 20,
        triggerEvent: "enter",
      });
    }
  };

  const getAnimationDescription = () => {
    const { type, duration, delay, triggerPoint, triggerEvent } = value;

    const triggerText = triggerEvent === "enter" ? "enters viewport" : 
                       triggerEvent === "exit" ? "exits viewport" : "enters/exits viewport";
    
    const typeText = type === "fade" ? "Fades in" :
                     type === "slide" ? "Slides in" :
                     type === "zoom" ? "Zooms in" :
                     type === "rotate" ? "Rotates in" :
                     "Animates";

    return `${typeText} when element ${triggerText} (${triggerPoint}% visible). Duration: ${duration}ms${delay && delay > 0 ? `, Delay: ${delay}ms` : ""}.`;
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Scroll Animation
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Animate element when scrolling into view
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
          {/* Animation Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Animation Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("fadeIn")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Fade In
              </button>
              <button
                type="button"
                onClick={() => applyPreset("slideUp")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Slide Up
              </button>
              <button
                type="button"
                onClick={() => applyPreset("slideUpFade")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Slide + Fade
              </button>
              <button
                type="button"
                onClick={() => applyPreset("zoomIn")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Zoom In
              </button>
              <button
                type="button"
                onClick={() => applyPreset("rotateIn")}
                className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                Rotate In
              </button>
            </div>
          </div>

          {/* Animation Type */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Animation Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "fade", label: "Fade" },
                { value: "slide", label: "Slide" },
                { value: "zoom", label: "Zoom" },
                { value: "rotate", label: "Rotate" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleAnimationTypeChange(type.value as any)}
                  className={`px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                    value.type === type.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slide Direction (only for slide type) */}
          {value.type === "slide" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Slide Direction
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "up", label: "↑ Up" },
                  { value: "down", label: "↓ Down" },
                  { value: "left", label: "← Left" },
                  { value: "right", label: "→ Right" },
                ].map((dir) => (
                  <button
                    key={dir.value}
                    type="button"
                    onClick={() => handleDirectionChange(dir.value as any)}
                    className="px-2 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Duration
              </label>
              <span className="text-xs font-mono text-gray-500">{value.duration}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={value.duration}
              onChange={(e) => handleDurationChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Fast (100ms)</span>
              <span>Slow (2000ms)</span>
            </div>
          </div>

          {/* Trigger Point */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600">
                Trigger Point
              </label>
              <span className="text-xs font-mono text-gray-500">{value.triggerPoint || 20}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={value.triggerPoint || 20}
              onChange={(e) => handleTriggerPointChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Top (0%)</span>
              <span>Bottom (100%)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Animation starts when {value.triggerPoint || 20}% of element is visible
            </p>
          </div>

          {/* Advanced Settings */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800"
          >
            <Eye className="w-3.5 h-3.5" />
            {showAdvanced ? "Hide" : "Show"} Advanced Settings
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {/* Delay */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Delay
                  </label>
                  <span className="text-xs font-mono text-gray-500">{value.delay || 0}ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={value.delay || 0}
                  onChange={(e) => handleDelayChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Wait before starting animation
                </p>
              </div>

              {/* Easing */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Easing Curve
                </label>
                <select
                  value={value.easing}
                  onChange={(e) => handleEasingChange(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="linear">Linear</option>
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                </select>
              </div>

              {/* Trigger Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Trigger Event
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "enter", label: "Enter" },
                    { value: "exit", label: "Exit" },
                    { value: "enter-exit", label: "Both" },
                  ].map((trig) => (
                    <button
                      key={trig.value}
                      type="button"
                      onClick={() => handleTriggerEventChange(trig.value as any)}
                      className={`px-2 py-2 text-xs font-medium border rounded-lg transition-all ${
                        value.triggerEvent === trig.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      {trig.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Description */}
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Play className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-800 font-medium mb-1">
                  Animation Preview:
                </p>
                <p className="text-xs text-green-700">
                  {getAnimationDescription()}
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
