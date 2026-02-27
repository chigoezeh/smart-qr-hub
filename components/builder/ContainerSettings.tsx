"use client";

import { PageElement, Spacing, LayoutConfig, StyleConfig, BorderConfig, BoxShadow, ParallaxConfig } from "@/types/landing-page";
import { X, Save, Layout, Palette, Ruler, Eye, Sparkles } from "lucide-react";
import { useState } from "react";
import LayoutPicker from "./LayoutPicker";
import SpacingEditor from "./SpacingEditor";
import BorderBuilder from "./BorderBuilder";
import ShadowBuilder from "./ShadowBuilder";
import ColorPicker from "./ColorPicker";
import StickySettings from "./StickySettings";
import ParallaxSettings from "./ParallaxSettings";
import GridTemplateTool from "./GridTemplateTool";

interface ContainerSettingsProps {
  element: PageElement | null;
  onClose: () => void;
  onUpdate: (updatedElement: PageElement) => void;
}

type TabType = "layout" | "spacing" | "style" | "effects" | "visibility";

export default function ContainerSettings({ element, onClose, onUpdate }: ContainerSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("layout");
  const [saving, setSaving] = useState(false);

  if (!element) return null;

  const [formData, setFormData] = useState({
    containerName: element.containerName || "",
    layoutConfig: element.layoutConfig || { type: "stack" as const },
    styleConfig: element.styleConfig || {},
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedElement: PageElement = {
        ...element,
        containerName: formData.containerName,
        layoutConfig: formData.layoutConfig,
        styleConfig: formData.styleConfig,
      };
      
      onUpdate(updatedElement);
      onClose();
    } catch (error) {
      console.error("Failed to save container settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updatePadding = (padding: Spacing) => {
    setFormData({
      ...formData,
      styleConfig: {
        ...formData.styleConfig,
        padding,
      },
    });
  };

  const updateMargin = (margin: Spacing) => {
    setFormData({
      ...formData,
      styleConfig: {
        ...formData.styleConfig,
        margin,
      },
    });
  };

  const updateLayoutConfig = (layoutConfig: LayoutConfig) => {
    setFormData({
      ...formData,
      layoutConfig,
    });
  };

  const tabs = [
    { id: "layout" as TabType, label: "Layout", icon: Layout },
    { id: "spacing" as TabType, label: "Spacing", icon: Ruler },
    { id: "style" as TabType, label: "Style", icon: Palette },
    { id: "effects" as TabType, label: "Effects", icon: Sparkles },
    { id: "visibility" as TabType, label: "Visibility", icon: Eye },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Container Settings</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            {element.type === "section" ? "Section" : element.type === "container" ? "Container" : "Column"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Container Name */}
      <div className="px-6 py-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Container Name (optional)
        </label>
        <input
          type="text"
          value={formData.containerName}
          onChange={(e) => setFormData({ ...formData, containerName: e.target.value })}
          placeholder="e.g., Hero Section, Features Grid"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "layout" && (
          <div>
            <LayoutPicker
              currentLayout={formData.layoutConfig}
              onSelectLayout={updateLayoutConfig}
            />
            
            {/* Max Width */}
            <div className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Width
              </label>
              <select
                value={formData.layoutConfig.maxWidth || "lg"}
                onChange={(e) => updateLayoutConfig({
                  ...formData.layoutConfig,
                  maxWidth: e.target.value as any,
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="sm">Small (640px)</option>
                <option value="md">Medium (768px)</option>
                <option value="lg">Large (1024px)</option>
                <option value="xl">Extra Large (1280px)</option>
                <option value="2xl">2X Large (1536px)</option>
                <option value="full">Full Width</option>
              </select>
            </div>

            {/* Gap/Spacing Between Items */}
            {formData.layoutConfig.type !== "stack" && (
              <div className="mt-6 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Gap Between Items
                </label>
                <input
                  type="range"
                  value={formData.layoutConfig.gap || 16}
                  onChange={(e) => updateLayoutConfig({
                    ...formData.layoutConfig,
                    gap: parseInt(e.target.value),
                  })}
                  min="0"
                  max="64"
                  className="w-full"
                />
                <div className="text-sm text-gray-600 text-center">
                  {formData.layoutConfig.gap || 16}px
                </div>
              </div>
            )}

            {/* Advanced Grid Template Tool */}
            {formData.layoutConfig.type === "grid" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Advanced Grid Controls</h4>
                <GridTemplateTool
                  gridTemplateColumns={formData.layoutConfig.gridTemplateColumns}
                  gridTemplateRows={formData.layoutConfig.gridTemplateRows}
                  gridAutoFlow={formData.layoutConfig.gridAutoFlow}
                  gridGap={formData.layoutConfig.gridGap || formData.layoutConfig.gap}
                  onChange={(gridConfig) => updateLayoutConfig({
                    ...formData.layoutConfig,
                    gridTemplateColumns: gridConfig.gridTemplateColumns,
                    gridTemplateRows: gridConfig.gridTemplateRows,
                    gridAutoFlow: gridConfig.gridAutoFlow,
                    gridGap: gridConfig.gridGap,
                  })}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "spacing" && (
          <div className="space-y-6">
            <SpacingEditor
              label="Padding (Inner spacing)"
              value={(formData.styleConfig.padding as Spacing) || { top: 0, right: 0, bottom: 0, left: 0 }}
              onChange={updatePadding}
            />

            <div className="border-t border-gray-200 pt-6">
              <SpacingEditor
                label="Margin (Outer spacing)"
                value={(formData.styleConfig.margin as Spacing) || { top: 0, right: 0, bottom: 0, left: 0 }}
                onChange={updateMargin}
              />
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-6">
            {/* Background Color with ColorPicker */}
            <div>
              <ColorPicker
                value={formData.styleConfig.backgroundColor || "#ffffff"}
                onChange={(color) => setFormData({
                  ...formData,
                  styleConfig: {
                    ...formData.styleConfig,
                    backgroundColor: color,
                  },
                })}
                showGradient={true}
                label="Background Color"
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL
              </label>
              <input
                type="url"
                value={formData.styleConfig.backgroundImage || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  styleConfig: {
                    ...formData.styleConfig,
                    backgroundImage: e.target.value,
                  },
                })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Border Builder */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Border</h4>
              <BorderBuilder
                value={formData.styleConfig.border || {
                  style: "none",
                  width: { top: 0, right: 0, bottom: 0, left: 0 },
                  color: "#e5e7eb",
                  radius: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
                }}
                onChange={(border) => setFormData({
                  ...formData,
                  styleConfig: {
                    ...formData.styleConfig,
                    border,
                  },
                })}
              />
            </div>

            {/* Shadow Builder */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Box Shadow</h4>
              <ShadowBuilder
                value={formData.styleConfig.boxShadow || []}
                onChange={(boxShadow) => setFormData({
                  ...formData,
                  styleConfig: {
                    ...formData.styleConfig,
                    boxShadow,
                  },
                })}
              />
            </div>

            {/* Sticky Positioning */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Sticky Position</h4>
              <StickySettings
                enabled={formData.styleConfig.position === "sticky"}
                top={formData.styleConfig.top as number}
                right={formData.styleConfig.right as number}
                bottom={formData.styleConfig.bottom as number}
                left={formData.styleConfig.left as number}
                zIndex={formData.styleConfig.zIndex}
                onChange={(settings) => setFormData({
                  ...formData,
                  styleConfig: {
                    ...formData.styleConfig,
                    ...settings,
                  },
                })}
              />
            </div>
          </div>
        )}

        {activeTab === "effects" && (
          <div className="space-y-6">
            {/* Parallax Effects */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Parallax Scrolling</h4>
              <ParallaxSettings
                value={formData.styleConfig.parallax || {
                  enabled: false,
                  speed: 0.5,
                  axis: "y",
                  scale: false,
                  opacity: false,
                }}
                onChange={(parallax) => setFormData({
                  ...formData,
                  styleConfig: {
                    ...formData.styleConfig,
                    parallax,
                  },
                })}
              />
            </div>

            {/* Future: Scroll Animations */}
            <div className="pt-6 border-t border-gray-200 opacity-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Scroll Animations (Coming Soon)
              </h4>
              <p className="text-xs text-gray-600">
                Fade in, slide in, zoom, and other entrance animations triggered by scroll
              </p>
            </div>

            {/* Future: Hover Effects */}
            <div className="pt-6 border-t border-gray-200 opacity-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Hover Effects (Coming Soon)
              </h4>
              <p className="text-xs text-gray-600">
                Lift, grow, glow, and other hover state transformations
              </p>
            </div>
          </div>
        )}

        {activeTab === "visibility" && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={element.isVisible}
                  onChange={(e) => {
                    const updatedElement = { ...element, isVisible: e.target.checked };
                    onUpdate(updatedElement);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Visible</span>
              </label>
              <p className="text-xs text-gray-600 mt-1 ml-6">
                Hide this container from the published page
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Device Visibility (Coming Soon)
              </h4>
              <div className="space-y-2 opacity-50 pointer-events-none">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Show on Mobile</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Show on Tablet</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Show on Desktop</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
