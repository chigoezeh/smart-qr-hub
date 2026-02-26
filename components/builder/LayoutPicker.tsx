"use client";

import { LayoutPreset, LayoutConfig } from "@/types/landing-page";
import { Columns2, Columns3, Grid2X2, Grid3X3, Layout } from "lucide-react";
import { useState } from "react";

interface LayoutPickerProps {
  onSelectLayout: (config: LayoutConfig) => void;
  currentLayout?: LayoutConfig;
}

interface LayoutOption {
  preset: LayoutPreset;
  name: string;
  description: string;
  icon: React.ReactNode;
  config: LayoutConfig;
}

export default function LayoutPicker({ onSelectLayout, currentLayout }: LayoutPickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<LayoutPreset>("single-column");

  const layoutOptions: LayoutOption[] = [
    {
      preset: "single-column",
      name: "Single Column",
      description: "Full width, stacked vertically",
      icon: <div className="w-full h-12 bg-blue-200 rounded" />,
      config: {
        type: "stack",
        maxWidth: "lg",
      },
    },
    {
      preset: "two-column-equal",
      name: "2 Columns (Equal)",
      description: "50% / 50% split",
      icon: (
        <div className="flex gap-2 w-full">
          <div className="flex-1 h-12 bg-blue-200 rounded" />
          <div className="flex-1 h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 24,
        columns: { mobile: 1, tablet: 2, desktop: 2 },
      },
    },
    {
      preset: "two-column-60-40",
      name: "2 Columns (60/40)",
      description: "Main content with sidebar",
      icon: (
        <div className="flex gap-2 w-full">
          <div className="w-[60%] h-12 bg-blue-200 rounded" />
          <div className="w-[40%] h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "3fr 2fr",
        gap: 24,
        columns: { mobile: 1, tablet: 2, desktop: 2 },
      },
    },
    {
      preset: "two-column-40-60",
      name: "2 Columns (40/60)",
      description: "Sidebar with main content",
      icon: (
        <div className="flex gap-2 w-full">
          <div className="w-[40%] h-12 bg-blue-200 rounded" />
          <div className="w-[60%] h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "2fr 3fr",
        gap: 24,
        columns: { mobile: 1, tablet: 2, desktop: 2 },
      },
    },
    {
      preset: "two-column-70-30",
      name: "2 Columns (70/30)",
      description: "Wide content + narrow sidebar",
      icon: (
        <div className="flex gap-2 w-full">
          <div className="w-[70%] h-12 bg-blue-200 rounded" />
          <div className="w-[30%] h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "7fr 3fr",
        gap: 24,
        columns: { mobile: 1, tablet: 2, desktop: 2 },
      },
    },
    {
      preset: "three-column-equal",
      name: "3 Columns (Equal)",
      description: "33% / 33% / 33% split",
      icon: (
        <div className="flex gap-1.5 w-full">
          <div className="flex-1 h-12 bg-blue-200 rounded" />
          <div className="flex-1 h-12 bg-blue-200 rounded" />
          <div className="flex-1 h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        columns: { mobile: 1, tablet: 2, desktop: 3 },
      },
    },
    {
      preset: "three-column-50-25-25",
      name: "3 Columns (50/25/25)",
      description: "Featured + 2 sidebars",
      icon: (
        <div className="flex gap-1.5 w-full">
          <div className="w-[50%] h-12 bg-blue-200 rounded" />
          <div className="w-[25%] h-12 bg-blue-200 rounded" />
          <div className="w-[25%] h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 20,
        columns: { mobile: 1, tablet: 2, desktop: 3 },
      },
    },
    {
      preset: "four-column-equal",
      name: "4 Columns (Equal)",
      description: "25% each (great for cards)",
      icon: (
        <div className="flex gap-1 w-full">
          <div className="flex-1 h-12 bg-blue-200 rounded" />
          <div className="flex-1 h-12 bg-blue-200 rounded" />
          <div className="flex-1 h-12 bg-blue-200 rounded" />
          <div className="flex-1 h-12 bg-blue-200 rounded" />
        </div>
      ),
      config: {
        type: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        columns: { mobile: 1, tablet: 2, desktop: 4 },
      },
    },
  ];

  const handleSelectLayout = (option: LayoutOption) => {
    setSelectedPreset(option.preset);
    onSelectLayout(option.config);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Choose Layout
        </h3>
        <p className="text-xs text-gray-600">
          Select a preset layout or create a custom grid
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {layoutOptions.map((option) => (
          <button
            key={option.preset}
            onClick={() => handleSelectLayout(option)}
            className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-500 hover:bg-blue-50 ${
              selectedPreset === option.preset
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-3">{option.icon}</div>
            <div>
              <div className="font-medium text-sm text-gray-900">{option.name}</div>
              <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Grid Builder (Future Enhancement) */}
      <div className="pt-4 border-t border-gray-200">
        <button
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          onClick={() => {
            // TODO: Open custom grid builder modal
            alert("Custom grid builder coming soon!");
          }}
        >
          <Grid3X3 className="w-4 h-4" />
          Custom Grid Builder
        </button>
      </div>
    </div>
  );
}
