"use client";

import { PageElement } from "@/types/landing-page";
import { ChevronDown, ChevronRight, Eye, EyeOff, Trash2, Copy, GripVertical, Box, Layers, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { BLOCK_TYPES } from "@/lib/block-registry";

interface LayersPanelProps {
  root: PageElement;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export default function LayersPanel({
  root,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onDeleteElement,
  onDuplicateElement,
}: LayersPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Page Structure
        </h3>
        <p className="text-xs text-gray-600 mt-0.5">
          Elements hierarchy
        </p>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <LayerTreeNode
          element={root}
          level={0}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          onToggleVisibility={onToggleVisibility}
          onDeleteElement={onDeleteElement}
          onDuplicateElement={onDuplicateElement}
        />
      </div>
    </div>
  );
}

interface LayerTreeNodeProps {
  element: PageElement;
  level: number;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

function LayerTreeNode({
  element,
  level,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onDeleteElement,
  onDuplicateElement,
}: LayerTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = element.children.length > 0;
  const isSelected = element.id === selectedElementId;

  const getElementIcon = () => {
    if (element.type === "section") return <Layers className="w-4 h-4 text-purple-600" />;
    if (element.type === "container") return <Box className="w-4 h-4 text-blue-600" />;
    if (element.type === "column") return <Grid3X3 className="w-4 h-4 text-green-600" />;
    if (element.type === "block" && element.blockType) {
      const BlockIcon = BLOCK_TYPES[element.blockType]?.icon;
      return BlockIcon ? <BlockIcon className="w-4 h-4 text-gray-600" /> : null;
    }
    return null;
  };

  const getElementLabel = () => {
    if (element.type === "block") {
      return element.blockTitle || BLOCK_TYPES[element.blockType!]?.name || "Block";
    }
    return element.containerName || `${element.type.charAt(0).toUpperCase()}${element.type.slice(1)}`;
  };

  return (
    <div className="select-none">
      {/* Node */}
      <div
        className={`group flex items-center gap-1 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors ${
          isSelected ? "bg-blue-50 hover:bg-blue-100" : ""
        } ${!element.isVisible ? "opacity-50" : ""}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelectElement(element.id)}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Drag Handle */}
        <GripVertical className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

        {/* Icon */}
        {getElementIcon()}

        {/* Label */}
        <span className={`flex-1 text-sm truncate ${isSelected ? "font-medium text-blue-900" : "text-gray-900"}`}>
          {getElementLabel()}
        </span>

        {/* Type Badge */}
        <span className="text-[10px] font-medium text-gray-500 uppercase px-1.5 py-0.5 bg-gray-100 rounded">
          {element.type === "block" ? element.blockType : element.type}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(element.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title={element.isVisible ? "Hide" : "Show"}
          >
            {element.isVisible ? (
              <Eye className="w-3.5 h-3.5 text-gray-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-gray-600" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateElement(element.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5 text-gray-600" />
          </button>

          {level > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${getElementLabel()}?`)) {
                  onDeleteElement(element.id);
                }
              }}
              className="p-1 hover:bg-red-100 rounded"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {element.children.map((child) => (
            <LayerTreeNode
              key={child.id}
              element={child}
              level={level + 1}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
              onToggleVisibility={onToggleVisibility}
              onDeleteElement={onDeleteElement}
              onDuplicateElement={onDuplicateElement}
            />
          ))}
        </div>
      )}
    </div>
  );
}
