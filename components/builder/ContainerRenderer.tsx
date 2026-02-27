"use client";

import { PageElement, BlockType } from "@/types/landing-page";
import { generateElementClasses, generateElementStyles } from "@/lib/page-builder-utils";
import BlockRenderer from "../blocks/BlockRenderer";
import { LandingPageBlock } from "@/types/landing-page";
import { useState } from "react";

interface ContainerRendererProps {
  element: PageElement;
  isPreview?: boolean;
  isSelected?: boolean;
  dragOverId?: string | null;
  onClick?: (element: PageElement) => void;
  onDrop?: (targetElementId: string, blockType: BlockType) => void;
  onDragOver?: (elementId: string) => void;
  onDragLeave?: () => void;
}

export default function ContainerRenderer({
  element,
  isPreview = false,
  isSelected = false,
  dragOverId = null,
  onClick,
  onDrop,
  onDragOver,
  onDragLeave,
}: ContainerRendererProps) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  
  // Don't render invisible elements in preview mode
  if (!element.isVisible && isPreview) {
    return null;
  }

  const classes = generateElementClasses(element);
  const styles = generateElementStyles(element);
  const isDropTarget = dragOverId === element.id;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !isPreview) {
      e.stopPropagation();
      onClick(element);
    }
  };

  // Drag and drop handlers (only for containers, not blocks)
  const handleDragOver = (e: React.DragEvent) => {
    if (isPreview || element.type === "block") return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(true);
    
    if (onDragOver) {
      onDragOver(element.id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isPreview || element.type === "block") return;
    
    e.stopPropagation();
    setIsDraggedOver(false);
    
    if (onDragLeave) {
      onDragLeave();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isPreview || element.type === "block") return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);
    
    const blockType = e.dataTransfer.getData("blockType") as BlockType;
    if (blockType && onDrop) {
      onDrop(element.id, blockType);
    }
  };

  // Render block (leaf node)
  if (element.type === "block" && element.blockType && element.blockContent) {
    const mockBlock: LandingPageBlock = {
      id: parseInt(element.id) || 0,
      landingPageId: 0,
      blockType: element.blockType,
      title: element.blockTitle,
      content: element.blockContent,
      displayOrder: element.displayOrder,
      isVisible: element.isVisible,
      backgroundColor: element.styleConfig?.backgroundColor,
      textColor: element.styleConfig?.textColor as string | undefined,
      customStyles: element.styleConfig,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return (
      <div
        onClick={handleClick}
        className={`relative ${isSelected && !isPreview ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
        style={styles}
      >
        <BlockRenderer block={mockBlock} isPreview={isPreview} />
      </div>
    );
  }

  // Render container (section/container/column)
  return (
    <div
      id={element.customId}
      data-element-id={element.id}
      className={`relative ${classes} ${
        isSelected && !isPreview ? "ring-2 ring-blue-500 ring-offset-2" : ""
      } ${
        (isDraggedOver || isDropTarget) && !isPreview ? "ring-2 ring-green-500 ring-offset-2 bg-green-50" : ""
      }`}
      style={styles}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Container label (only in edit mode) */}
      {!isPreview && element.containerName && (
        <div className="absolute -top-6 left-0 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded z-10">
          {element.containerName}
        </div>
      )}

      {/* Drop indicator */}
      {(isDraggedOver || isDropTarget) && !isPreview && (
        <div className="absolute inset-0 border-2 border-dashed border-green-500 bg-green-50 bg-opacity-20 pointer-events-none z-20 flex items-center justify-center">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Drop block here
          </span>
        </div>
      )}

      {/* Render children */}
      {element.children.map((child) => (
        <ContainerRenderer
          key={child.id}
          element={child}
          isPreview={isPreview}
          isSelected={isSelected}
          dragOverId={dragOverId}
          onClick={onClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      ))}

      {/* Empty state */}
      {element.children.length === 0 && !isPreview && (
        <div className="flex items-center justify-center min-h-32 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="text-sm font-medium">Empty {element.type}</p>
            <p className="text-xs mt-1">Drag blocks or containers here</p>
          </div>
        </div>
      )}
    </div>
  );
}
