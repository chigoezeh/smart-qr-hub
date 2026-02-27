import { PageElement, PageStructure, LandingPageBlock, LayoutConfig } from "@/types/landing-page";
import { v4 as uuidv4 } from "uuid";

/**
 * Utility functions for managing hierarchical page structures
 */

/**
 * Create a new empty page structure
 */
export function createEmptyPageStructure(): PageStructure {
  return {
    version: "2.0",
    root: {
      id: uuidv4(),
      type: "section",
      layoutConfig: {
        type: "stack",
        maxWidth: "lg",
      },
      styleConfig: {},
      responsiveConfig: {},
      children: [],
      displayOrder: 0,
      isVisible: true,
    },
  };
}

/**
 * Create a new container element
 */
export function createContainer(
  type: "section" | "container" | "column" = "container",
  layoutConfig?: LayoutConfig
): PageElement {
  return {
    id: uuidv4(),
    type,
    layoutConfig: layoutConfig || {
      type: "stack",
    },
    styleConfig: {},
    responsiveConfig: {},
    children: [],
    displayOrder: 0,
    isVisible: true,
    containerName: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
  };
}

/**
 * Create a block element from legacy block data
 */
export function createBlockElement(block: LandingPageBlock): PageElement {
  return {
    id: uuidv4(),
    type: "block",
    blockType: block.blockType,
    blockTitle: block.title,
    blockContent: block.content,
    styleConfig: {
      backgroundColor: block.backgroundColor,
    },
    responsiveConfig: {},
    children: [],
    displayOrder: block.displayOrder,
    isVisible: block.isVisible,
  };
}

/**
 * Find an element by ID in the tree
 */
export function findElementById(root: PageElement, id: string): PageElement | null {
  if (root.id === id) {
    return root;
  }

  for (const child of root.children) {
    const found = findElementById(child, id);
    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Find parent of an element
 */
export function findParentElement(root: PageElement, childId: string): PageElement | null {
  for (const child of root.children) {
    if (child.id === childId) {
      return root;
    }
    const found = findParentElement(child, childId);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Update an element in the tree
 */
export function updateElement(root: PageElement, id: string, updates: Partial<PageElement>): PageElement {
  if (root.id === id) {
    return { ...root, ...updates };
  }

  return {
    ...root,
    children: root.children.map((child) => updateElement(child, id, updates)),
  };
}

/**
 * Add a child element to a parent
 */
export function addChildElement(
  root: PageElement,
  parentId: string,
  child: PageElement,
  index?: number
): PageElement {
  if (root.id === parentId) {
    const newChildren = [...root.children];
    if (index !== undefined) {
      newChildren.splice(index, 0, child);
    } else {
      newChildren.push(child);
    }
    // Update display orders
    newChildren.forEach((c, i) => {
      c.displayOrder = i;
    });
    return { ...root, children: newChildren };
  }

  return {
    ...root,
    children: root.children.map((c) => addChildElement(c, parentId, child, index)),
  };
}

/**
 * Remove an element from the tree
 */
export function removeElement(root: PageElement, id: string): PageElement {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => removeElement(child, id))
      .map((child, index) => ({ ...child, displayOrder: index })),
  };
}

/**
 * Move an element to a new parent
 */
export function moveElement(
  root: PageElement,
  elementId: string,
  newParentId: string,
  index?: number
): PageElement {
  // Find the element
  const element = findElementById(root, elementId);
  if (!element) {
    return root;
  }

  // Remove from old parent
  let updatedRoot = removeElement(root, elementId);

  // Add to new parent
  updatedRoot = addChildElement(updatedRoot, newParentId, element, index);

  return updatedRoot;
}

/**
 * Duplicate an element
 */
export function duplicateElement(root: PageElement, id: string): PageElement {
  const element = findElementById(root, id);
  if (!element) {
    return root;
  }

  const parent = findParentElement(root, id);
  if (!parent) {
    return root;
  }

  // Create a deep clone with new IDs
  const clone = cloneElementWithNewIds(element);
  clone.containerName = element.containerName ? `${element.containerName} (Copy)` : undefined;
  clone.blockTitle = element.blockTitle ? `${element.blockTitle} (Copy)` : undefined;

  // Add after the original
  const originalIndex = parent.children.findIndex((c) => c.id === id);
  return addChildElement(root, parent.id, clone, originalIndex + 1);
}

/**
 * Clone an element with new UUIDs
 */
function cloneElementWithNewIds(element: PageElement): PageElement {
  return {
    ...element,
    id: uuidv4(),
    children: element.children.map(cloneElementWithNewIds),
  };
}

/**
 * Flatten tree to array (depth-first)
 */
export function flattenTree(root: PageElement): PageElement[] {
  const result: PageElement[] = [root];
  for (const child of root.children) {
    result.push(...flattenTree(child));
  }
  return result;
}

/**
 * Get all blocks from tree
 */
export function getAllBlocks(root: PageElement): PageElement[] {
  return flattenTree(root).filter((el) => el.type === "block");
}

/**
 * Convert legacy flat blocks to hierarchical structure
 */
export function migrateBlocksToHierarchy(blocks: LandingPageBlock[]): PageStructure {
  const rootSection: PageElement = {
    id: uuidv4(),
    type: "section",
    layoutConfig: {
      type: "stack",
      maxWidth: "lg",
    },
    styleConfig: {
      padding: { top: 40, right: 20, bottom: 40, left: 20 },
    },
    responsiveConfig: {},
    children: blocks
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(createBlockElement),
    displayOrder: 0,
    isVisible: true,
    containerName: "Main Section",
  };

  return {
    version: "2.0",
    root: rootSection,
    metadata: {
      lastEditedAt: new Date(),
    },
  };
}

/**
 * Convert hierarchy back to flat blocks (for backward compatibility)
 */
export function flattenHierarchyToBlocks(structure: PageStructure): Partial<LandingPageBlock>[] {
  const blocks = getAllBlocks(structure.root);
  
  return blocks.map((block, index) => ({
    blockType: block.blockType!,
    title: block.blockTitle,
    content: block.blockContent!,
    displayOrder: index,
    isVisible: block.isVisible,
    backgroundColor: block.styleConfig?.backgroundColor,
    textColor: block.styleConfig?.textColor as string | undefined,
    customStyles: block.styleConfig,
  }));
}

/**
 * Generate CSS classes for an element
 */
export function generateElementClasses(element: PageElement, device: "mobile" | "tablet" | "desktop" = "desktop"): string {
  const classes: string[] = [];
  
  // Layout type
  if (element.layoutConfig) {
    const layout = element.layoutConfig;
    switch (layout.type) {
      case "flex":
        classes.push("flex");
        if (layout.flexDirection) classes.push(`flex-${layout.flexDirection}`);
        if (layout.justifyContent) classes.push(`justify-${layout.justifyContent}`);
        if (layout.alignItems) classes.push(`items-${layout.alignItems}`);
        if (layout.flexWrap) classes.push(`flex-${layout.flexWrap}`);
        if (layout.gap) classes.push(`gap-${layout.gap}`);
        break;
      case "grid":
        classes.push("grid");
        if (layout.gridGap) classes.push(`gap-${layout.gridGap}`);
        break;
      case "stack":
        classes.push("flex flex-col space-y-4");
        break;
    }
    
    // Max width
    if (layout.maxWidth) {
      const widthMap: Record<string, string> = {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
      };
      classes.push(widthMap[layout.maxWidth as string] || "max-w-screen-lg");
      classes.push("mx-auto");
    }
  }
  
  // Custom className
  if (element.customClassName) {
    classes.push(element.customClassName);
  }
  
  return classes.join(" ");
}

/**
 * Generate inline styles for an element
 */
export function generateElementStyles(element: PageElement): React.CSSProperties {
  const styles: React.CSSProperties = {};
  const styleConfig = element.styleConfig;
  
  if (!styleConfig) return styles;
  
  // Spacing
  if (styleConfig.padding) {
    const p = styleConfig.padding as any;
    if (typeof p === "object" && "top" in p) {
      styles.paddingTop = `${p.top}px`;
      styles.paddingRight = `${p.right}px`;
      styles.paddingBottom = `${p.bottom}px`;
      styles.paddingLeft = `${p.left}px`;
    }
  }
  
  if (styleConfig.margin) {
    const m = styleConfig.margin as any;
    if (typeof m === "object" && "top" in m) {
      styles.marginTop = `${m.top}px`;
      styles.marginRight = `${m.right}px`;
      styles.marginBottom = `${m.bottom}px`;
      styles.marginLeft = `${m.left}px`;
    }
  }
  
  // Background
  if (styleConfig.backgroundColor) {
    styles.backgroundColor = styleConfig.backgroundColor;
  }
  
  if (styleConfig.backgroundImage) {
    styles.backgroundImage = `url(${styleConfig.backgroundImage})`;
    styles.backgroundSize = styleConfig.backgroundSize || "cover";
    styles.backgroundPosition = styleConfig.backgroundPosition || "center";
    styles.backgroundRepeat = styleConfig.backgroundRepeat || "no-repeat";
  }
  
  // Border
  if (styleConfig.borderRadius) {
    if (typeof styleConfig.borderRadius === "number") {
      styles.borderRadius = `${styleConfig.borderRadius}px`;
    }
  }
  
  // Display
  if (styleConfig.opacity !== undefined) {
    styles.opacity = styleConfig.opacity;
  }
  
  if (styleConfig.zIndex !== undefined) {
    styles.zIndex = styleConfig.zIndex;
  }
  
  // Grid specific
  if (element.layoutConfig?.type === "grid" && element.layoutConfig.gridTemplateColumns) {
    styles.gridTemplateColumns = element.layoutConfig.gridTemplateColumns;
  }
  
  return styles;
}
