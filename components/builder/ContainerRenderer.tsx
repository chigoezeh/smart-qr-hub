"use client";

import { PageElement } from "@/types/landing-page";
import { generateElementClasses, generateElementStyles } from "@/lib/page-builder-utils";
import BlockRenderer from "./blocks/BlockRenderer";
import { LandingPageBlock } from "@/types/landing-page";

interface ContainerRendererProps {
  element: PageElement;
  isPreview?: boolean;
  isSelected?: boolean;
  onClick?: (element: PageElement) => void;
}

export default function ContainerRenderer({
  element,
  isPreview = false,
  isSelected = false,
  onClick,
}: ContainerRendererProps) {
  // Don't render invisible elements in preview mode
  if (!element.isVisible && isPreview) {
    return null;
  }

  const classes = generateElementClasses(element);
  const styles = generateElementStyles(element);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !isPreview) {
      e.stopPropagation();
      onClick(element);
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
      className={`relative ${classes} ${isSelected && !isPreview ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
      style={styles}
      onClick={handleClick}
    >
      {/* Container label (only in edit mode) */}
      {!isPreview && element.containerName && (
        <div className="absolute -top-6 left-0 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded z-10">
          {element.containerName}
        </div>
      )}

      {/* Render children */}
      {element.children.map((child) => (
        <ContainerRenderer
          key={child.id}
          element={child}
          isPreview={isPreview}
          isSelected={isSelected}
          onClick={onClick}
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
