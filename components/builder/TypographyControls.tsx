"use client";

import { useState } from "react";
import { Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface TypographyConfig {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  textAlign?: "left" | "center" | "right" | "justify";
  color?: string;
}

interface TypographyControlsProps {
  value: TypographyConfig;
  onChange: (value: TypographyConfig) => void;
}

const FONT_FAMILIES = [
  { value: "system-ui, -apple-system, sans-serif", label: "System" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times" },
  { value: "Courier New, monospace", label: "Courier" },
  { value: "Monaco, monospace", label: "Monaco" },
];

const FONT_SIZES = [
  { value: "0.75rem", label: "XS (12px)" },
  { value: "0.875rem", label: "SM (14px)" },
  { value: "1rem", label: "Base (16px)" },
  { value: "1.125rem", label: "LG (18px)" },
  { value: "1.25rem", label: "XL (20px)" },
  { value: "1.5rem", label: "2XL (24px)" },
  { value: "1.875rem", label: "3XL (30px)" },
  { value: "2.25rem", label: "4XL (36px)" },
  { value: "3rem", label: "5XL (48px)" },
  { value: "3.75rem", label: "6XL (60px)" },
];

const FONT_WEIGHTS = [
  { value: 100, label: "Thin" },
  { value: 200, label: "Extra Light" },
  { value: 300, label: "Light" },
  { value: 400, label: "Normal" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi Bold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra Bold" },
  { value: 900, label: "Black" },
];

const LINE_HEIGHTS = [
  { value: 1, label: "None (1)" },
  { value: 1.25, label: "Tight (1.25)" },
  { value: 1.375, label: "Snug (1.375)" },
  { value: 1.5, label: "Normal (1.5)" },
  { value: 1.625, label: "Relaxed (1.625)" },
  { value: 2, label: "Loose (2)" },
];

export default function TypographyControls({ value, onChange }: TypographyControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const alignmentOptions = [
    { value: "left", icon: AlignLeft, label: "Left" },
    { value: "center", icon: AlignCenter, label: "Center" },
    { value: "right", icon: AlignRight, label: "Right" },
    { value: "justify", icon: AlignJustify, label: "Justify" },
  ] as const;

  const textTransformOptions = [
    { value: "none", label: "None" },
    { value: "uppercase", label: "UPPER" },
    { value: "lowercase", label: "lower" },
    { value: "capitalize", label: "Capitalize" },
  ] as const;

  const textDecorationOptions = [
    { value: "none", label: "None" },
    { value: "underline", label: "Underline" },
    { value: "line-through", label: "Strike" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
        <select
          value={value.fontFamily || FONT_FAMILIES[0].value}
          onChange={(e) => onChange({ ...value, fontFamily: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <select
          value={value.fontSize || "1rem"}
          onChange={(e) => onChange({ ...value, fontSize: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
        <div className="grid grid-cols-3 gap-2">
          {FONT_WEIGHTS.map((weight) => (
            <button
              key={weight.value}
              onClick={() => onChange({ ...value, fontWeight: weight.value })}
              className={`px-3 py-2 text-xs rounded border-2 transition-colors ${
                value.fontWeight === weight.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
              style={{ fontWeight: weight.value }}
            >
              {weight.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
        <div className="grid grid-cols-4 gap-2">
          {alignmentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onChange({ ...value, textAlign: option.value })}
                className={`flex items-center justify-center gap-1 px-3 py-2 text-xs rounded border-2 transition-colors ${
                  value.textAlign === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                title={option.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={value.color || "#000000"}
            onChange={(e) => onChange({ ...value, color: e.target.value })}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={value.color || "#000000"}
            onChange={(e) => onChange({ ...value, color: e.target.value })}
            placeholder="#000000"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Settings
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Line Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
            <select
              value={value.lineHeight || 1.5}
              onChange={(e) => onChange({ ...value, lineHeight: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LINE_HEIGHTS.map((height) => (
                <option key={height.value} value={height.value}>
                  {height.label}
                </option>
              ))}
            </select>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Letter Spacing</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-0.1"
                max="0.2"
                step="0.01"
                value={value.letterSpacing || 0}
                onChange={(e) => onChange({ ...value, letterSpacing: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="-0.2"
                max="0.5"
                step="0.01"
                value={value.letterSpacing || 0}
                onChange={(e) =>
                  onChange({ ...value, letterSpacing: parseFloat(e.target.value) || 0 })
                }
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">em</span>
            </div>
          </div>

          {/* Text Transform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Transform</label>
            <div className="grid grid-cols-4 gap-2">
              {textTransformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ ...value, textTransform: option.value })}
                  className={`px-3 py-2 text-xs rounded border-2 transition-colors ${
                    value.textTransform === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  style={{ textTransform: option.value }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Decoration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Decoration</label>
            <div className="grid grid-cols-3 gap-2">
              {textDecorationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ ...value, textDecoration: option.value })}
                  className={`px-3 py-2 text-xs rounded border-2 transition-colors ${
                    value.textDecoration === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  style={{ textDecoration: option.value }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Preview</p>
        <p
          style={{
            fontFamily: value.fontFamily,
            fontSize: value.fontSize,
            fontWeight: value.fontWeight,
            lineHeight: value.lineHeight,
            letterSpacing: value.letterSpacing ? `${value.letterSpacing}em` : undefined,
            textTransform: value.textTransform,
            textDecoration: value.textDecoration,
            textAlign: value.textAlign,
            color: value.color,
          }}
        >
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
}
