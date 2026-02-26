"use client";

import { useState } from "react";
import { BoxShadow } from "@/types/landing-page";
import { Plus, Trash2, Copy, Eye, EyeOff } from "lucide-react";

interface ShadowBuilderProps {
  value: BoxShadow[];
  onChange: (value: BoxShadow[]) => void;
}

const PRESET_SHADOWS = [
  { name: "None", value: [] },
  { name: "Small", value: [{ x: 0, y: 1, blur: 3, spread: 0, color: "rgba(0, 0, 0, 0.1)", inset: false }] },
  { name: "Medium", value: [{ x: 0, y: 4, blur: 6, spread: -1, color: "rgba(0, 0, 0, 0.1)", inset: false }] },
  { name: "Large", value: [{ x: 0, y: 10, blur: 15, spread: -3, color: "rgba(0, 0, 0, 0.1)", inset: false }] },
  { name: "XL", value: [{ x: 0, y: 20, blur: 25, spread: -5, color: "rgba(0, 0, 0, 0.1)", inset: false }] },
  { name: "Inner", value: [{ x: 0, y: 2, blur: 4, spread: 0, color: "rgba(0, 0, 0, 0.06)", inset: true }] },
  {
    name: "Outline",
    value: [{ x: 0, y: 0, blur: 0, spread: 3, color: "rgba(59, 130, 246, 0.5)", inset: false }],
  },
  {
    name: "Glow",
    value: [{ x: 0, y: 0, blur: 20, spread: 0, color: "rgba(59, 130, 246, 0.4)", inset: false }],
  },
];

export default function ShadowBuilder({ value, onChange }: ShadowBuilderProps) {
  const [activeShadowIndex, setActiveShadowIndex] = useState<number | null>(
    value.length > 0 ? 0 : null
  );

  const addShadow = () => {
    const newShadow: BoxShadow = {
      x: 0,
      y: 4,
      blur: 6,
      spread: 0,
      color: "rgba(0, 0, 0, 0.1)",
      inset: false,
    };
    onChange([...value, newShadow]);
    setActiveShadowIndex(value.length);
  };

  const removeShadow = (index: number) => {
    const newShadows = value.filter((_, i) => i !== index);
    onChange(newShadows);
    if (activeShadowIndex === index) {
      setActiveShadowIndex(newShadows.length > 0 ? 0 : null);
    } else if (activeShadowIndex !== null && activeShadowIndex > index) {
      setActiveShadowIndex(activeShadowIndex - 1);
    }
  };

  const duplicateShadow = (index: number) => {
    const shadowToDuplicate = { ...value[index] };
    onChange([...value, shadowToDuplicate]);
    setActiveShadowIndex(value.length);
  };

  const updateShadow = (index: number, updates: Partial<BoxShadow>) => {
    const newShadows = [...value];
    newShadows[index] = { ...newShadows[index], ...updates };
    onChange(newShadows);
  };

  const applyPreset = (preset: BoxShadow[]) => {
    onChange(preset);
    setActiveShadowIndex(preset.length > 0 ? 0 : null);
  };

  const generateCSSValue = () => {
    return value
      .map((shadow) => {
        const inset = shadow.inset ? "inset " : "";
        return `${inset}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
      })
      .join(", ");
  };

  const activeShadow = activeShadowIndex !== null ? value[activeShadowIndex] : null;

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_SHADOWS.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset.value)}
              className="px-3 py-2 text-xs rounded border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow Layers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Shadow Layers</label>
          <button
            onClick={addShadow}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Shadow
          </button>
        </div>

        {value.length === 0 ? (
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-500">No shadows added yet</p>
            <button
              onClick={addShadow}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first shadow
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {value.map((shadow, index) => (
              <div
                key={index}
                className={`p-3 rounded border-2 transition-colors cursor-pointer ${
                  activeShadowIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveShadowIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">
                      Shadow {index + 1}
                      {shadow.inset && <span className="ml-1 text-gray-500">(inset)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateShadow(index);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeShadow(index);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
                {/* Shadow preview */}
                <div
                  className="mt-2 h-8 bg-white rounded"
                  style={{
                    boxShadow: `${shadow.inset ? "inset " : ""}${shadow.x}px ${shadow.y}px ${
                      shadow.blur
                    }px ${shadow.spread}px ${shadow.color}`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Shadow Editor */}
      {activeShadow !== null && activeShadowIndex !== null && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Edit Shadow {activeShadowIndex + 1}</h4>

          {/* Inset Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Inset Shadow</label>
            <button
              onClick={() => updateShadow(activeShadowIndex, { inset: !activeShadow.inset })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                activeShadow.inset ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  activeShadow.inset ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* X Offset */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Horizontal Offset (X)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={activeShadow.x}
                onChange={(e) => updateShadow(activeShadowIndex, { x: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="-100"
                max="100"
                value={activeShadow.x}
                onChange={(e) => updateShadow(activeShadowIndex, { x: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">px</span>
            </div>
          </div>

          {/* Y Offset */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Vertical Offset (Y)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={activeShadow.y}
                onChange={(e) => updateShadow(activeShadowIndex, { y: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="-100"
                max="100"
                value={activeShadow.y}
                onChange={(e) => updateShadow(activeShadowIndex, { y: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">px</span>
            </div>
          </div>

          {/* Blur */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Blur Radius</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={activeShadow.blur}
                onChange={(e) => updateShadow(activeShadowIndex, { blur: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="200"
                value={activeShadow.blur}
                onChange={(e) => updateShadow(activeShadowIndex, { blur: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">px</span>
            </div>
          </div>

          {/* Spread */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Spread Radius</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={activeShadow.spread}
                onChange={(e) => updateShadow(activeShadowIndex, { spread: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="-100"
                max="100"
                value={activeShadow.spread}
                onChange={(e) =>
                  updateShadow(activeShadowIndex, { spread: parseInt(e.target.value) || 0 })
                }
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-600">px</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Shadow Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={activeShadow.color.startsWith("rgba") ? "#000000" : activeShadow.color}
                onChange={(e) => updateShadow(activeShadowIndex, { color: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={activeShadow.color}
                onChange={(e) => updateShadow(activeShadowIndex, { color: e.target.value })}
                placeholder="rgba(0, 0, 0, 0.1)"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Use rgba() for transparency</p>
          </div>
        </div>
      )}

      {/* CSS Output */}
      {value.length > 0 && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">CSS Output</label>
          <textarea
            value={generateCSSValue()}
            readOnly
            className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded bg-gray-50"
            rows={3}
          />
        </div>
      )}

      {/* Preview */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-3">Preview</p>
        <div className="flex items-center justify-center">
          <div
            className="w-40 h-40 bg-white rounded-lg"
            style={{ boxShadow: generateCSSValue() || "none" }}
          />
        </div>
      </div>
    </div>
  );
}
