"use client";

import { BlockType, LayoutConfig } from "@/types/landing-page";
import { getAllBlockTypes } from "@/lib/block-registry";
import { Box, Grid3X3, Layers, Plus } from "lucide-react";
import { useState } from "react";

interface AddElementPanelProps {
  onAddContainer: (type: "section" | "container" | "column", layoutConfig?: LayoutConfig) => void;
  onAddBlock: (blockType: BlockType) => void;
}

type TabType = "containers" | "blocks";

export default function AddElementPanel({ onAddContainer, onAddBlock }: AddElementPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("blocks");
  const [isExpanded, setIsExpanded] = useState(true);

  const containerTypes = [
    {
      type: "section" as const,
      name: "Section",
      description: "Full-width section",
      icon: Layers,
      color: "purple",
    },
    {
      type: "container" as const,
      name: "Container",
      description: "Content container",
      icon: Box,
      color: "blue",
    },
    {
      type: "column" as const,
      name: "Column",
      description: "Layout column",
      icon: Grid3X3,
      color: "green",
    },
  ];

  const quickLayouts = [
    {
      name: "2 Columns",
      config: { type: "grid" as const, gridTemplateColumns: "repeat(2, 1fr)", gap: 24 },
      preview: (
        <div className="flex gap-1">
          <div className="flex-1 h-6 bg-blue-200 rounded" />
          <div className="flex-1 h-6 bg-blue-200 rounded" />
        </div>
      ),
    },
    {
      name: "3 Columns",
      config: { type: "grid" as const, gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
      preview: (
        <div className="flex gap-1">
          <div className="flex-1 h-6 bg-blue-200 rounded" />
          <div className="flex-1 h-6 bg-blue-200 rounded" />
          <div className="flex-1 h-6 bg-blue-200 rounded" />
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Add Elements</h3>
          </div>
          <span className="text-xs text-gray-600">
            {isExpanded ? "−" : "+"}
          </span>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab("blocks")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "blocks"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Blocks
            </button>
            <button
              onClick={() => setActiveTab("containers")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "containers"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Layouts
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "blocks" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-3 px-1">
                  Drag blocks onto the canvas
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {getAllBlockTypes().map((blockType) => {
                    const Icon = blockType.icon;
                    return (
                      <button
                        key={blockType.type}
                        onClick={() => onAddBlock(blockType.type)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("blockType", blockType.type);
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        className="flex flex-col items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-left group"
                      >
                        <Icon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-gray-900 text-center">
                          {blockType.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "containers" && (
              <div className="space-y-4">
                {/* Container Types */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 px-1">
                    Container Types
                  </p>
                  <div className="space-y-2">
                    {containerTypes.map((container) => {
                      const Icon = container.icon;
                      return (
                        <button
                          key={container.type}
                          onClick={() => onAddContainer(container.type)}
                          className={`w-full flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-${container.color}-500 hover:bg-${container.color}-50 transition-all`}
                        >
                          <Icon className={`w-5 h-5 text-${container.color}-600`} />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">
                              {container.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {container.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Layouts */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 px-1">
                    Quick Layouts
                  </p>
                  <div className="space-y-2">
                    {quickLayouts.map((layout, index) => (
                      <button
                        key={index}
                        onClick={() => onAddContainer("container", layout.config)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <div className="mb-2">{layout.preview}</div>
                        <div className="text-xs font-medium text-gray-900 text-center">
                          {layout.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
