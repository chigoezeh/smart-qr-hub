"use client";

import { useState, useEffect, useCallback } from "react";
import { PageStructure, PageElement, DeviceBreakpoint, BlockType, LayoutConfig } from "@/types/landing-page";
import { 
  createContainer, 
  createBlockElement, 
  updateElement, 
  addChildElement, 
  removeElement, 
  duplicateElement,
  createEmptyPageStructure,
} from "@/lib/page-builder-utils";
import { savePageStructure, autoSavePageStructure, createPageVersion } from "@/actions/page-structure";
import { toast } from "sonner";
import { Save, History, Undo, Redo, Play } from "lucide-react";

// Components
import LayersPanel from "./LayersPanel";
import AddElementPanel from "./AddElementPanel";
import ContainerRenderer from "./ContainerRenderer";
import ContainerSettings from "./ContainerSettings";
import BlockSettingsPanel from "../BlockSettingsPanel";
import ResponsiveToolbar from "./ResponsiveToolbar";

interface AdvancedPageEditorProps {
  pageId: number;
  pageSlug: string;
  initialStructure: PageStructure;
}

export default function AdvancedPageEditor({ 
  pageId, 
  pageSlug, 
  initialStructure 
}: AdvancedPageEditorProps) {
  // Core state
  const [structure, setStructure] = useState<PageStructure>(initialStructure);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentDevice, setCurrentDevice] = useState<DeviceBreakpoint>("desktop");
  const [isPreview, setIsPreview] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<PageStructure[]>([initialStructure]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [editingElement, setEditingElement] = useState<PageElement | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await autoSavePageStructure(pageId, structure);
      setLastSaved(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [pageId, structure]);

  // Add to history when structure changes
  const updateStructure = useCallback((newStructure: PageStructure) => {
    setStructure(newStructure);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newStructure);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setStructure(history[historyIndex - 1]);
      toast.success("Undo");
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setStructure(history[historyIndex + 1]);
      toast.success("Redo");
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await savePageStructure(pageId, structure);
      if (result.success) {
        toast.success("Page saved!");
        setLastSaved(new Date());
      } else {
        toast.error(result.error || "Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  // Create version
  const handleCreateVersion = async () => {
    const description = prompt("Version description (optional):");
    if (description === null) return; // User cancelled

    const result = await createPageVersion(pageId, structure, description || undefined);
    if (result.success) {
      toast.success(`Version ${result.versionNumber} created!`);
    } else {
      toast.error(result.error || "Failed to create version");
    }
  };

  // Add container
  const handleAddContainer = (type: "section" | "container" | "column", layoutConfig?: LayoutConfig) => {
    if (!selectedElementId) {
      toast.error("Select a container first");
      return;
    }

    const newContainer = createContainer(type, layoutConfig);
    const newStructure = {
      ...structure,
      root: addChildElement(structure.root, selectedElementId, newContainer),
    };
    updateStructure(newStructure);
    toast.success(`${type} added!`);
  };

  // Add block
  const handleAddBlock = (blockType: BlockType) => {
    if (!selectedElementId) {
      toast.error("Select a container first");
      return;
    }

    // Create a mock block
    const mockBlock: any = {
      id: 0,
      landingPageId: pageId,
      blockType,
      title: `New ${blockType}`,
      content: getDefaultContentForBlockType(blockType),
      displayOrder: 0,
      isVisible: true,
    };

    const newBlock = createBlockElement(mockBlock);
    const newStructure = {
      ...structure,
      root: addChildElement(structure.root, selectedElementId, newBlock),
    };
    updateStructure(newStructure);
    toast.success(`${blockType} block added!`);
  };

  // Toggle visibility
  const handleToggleVisibility = (elementId: string) => {
    const element = findElement(structure.root, elementId);
    if (!element) return;

    const newStructure = {
      ...structure,
      root: updateElement(structure.root, elementId, { isVisible: !element.isVisible }),
    };
    updateStructure(newStructure);
  };

  // Delete element
  const handleDeleteElement = (elementId: string) => {
    const newStructure = {
      ...structure,
      root: removeElement(structure.root, elementId),
    };
    updateStructure(newStructure);
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
    toast.success("Element deleted");
  };

  // Duplicate element
  const handleDuplicateElement = (elementId: string) => {
    const newStructure = {
      ...structure,
      root: duplicateElement(structure.root, elementId),
    };
    updateStructure(newStructure);
    toast.success("Element duplicated");
  };

  // Update element from settings
  const handleUpdateElement = (updatedElement: PageElement) => {
    const newStructure = {
      ...structure,
      root: updateElement(structure.root, updatedElement.id, updatedElement),
    };
    updateStructure(newStructure);
    setEditingElement(null);
  };

  // Find element helper
  const findElement = (root: PageElement, id: string): PageElement | null => {
    if (root.id === id) return root;
    for (const child of root.children) {
      const found = findElement(child, id);
      if (found) return found;
    }
    return null;
  };

  const selectedElement = selectedElementId ? findElement(structure.root, selectedElementId) : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Page Builder</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
          
          <button
            onClick={handleCreateVersion}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <History className="w-4 h-4" />
            Save Version
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </button>

          <a
            href={`/l/${pageSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Play className="w-4 h-4" />
            Preview Live
          </a>
        </div>
      </div>

      {/* Responsive Toolbar */}
      <ResponsiveToolbar
        currentDevice={currentDevice}
        onDeviceChange={setCurrentDevice}
        onPreviewToggle={() => setIsPreview(!isPreview)}
        isPreview={isPreview}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Add Elements */}
        {!isPreview && (
          <div className="w-64 flex-shrink-0">
            <AddElementPanel
              onAddContainer={handleAddContainer}
              onAddBlock={handleAddBlock}
            />
          </div>
        )}

        {/* Left Sidebar - Layers */}
        {!isPreview && (
          <div className="w-64 flex-shrink-0">
            <LayersPanel
              root={structure.root}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onToggleVisibility={handleToggleVisibility}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
            />
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div
            className={`mx-auto bg-white shadow-xl transition-all duration-300 ${
              currentDevice === "mobile" ? "max-w-[375px]" :
              currentDevice === "tablet" ? "max-w-[768px]" :
              "max-w-[1440px]"
            }`}
            style={{ minHeight: "800px" }}
          >
            <ContainerRenderer
              element={structure.root}
              isPreview={isPreview}
              isSelected={selectedElementId === structure.root.id}
              onClick={(el) => {
                if (!isPreview) {
                  setSelectedElementId(el.id);
                  if (el.type !== "block") {
                    setEditingElement(el);
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        {!isPreview && selectedElement && selectedElement.type !== "block" && editingElement && (
          <ContainerSettings
            element={editingElement}
            onClose={() => setEditingElement(null)}
            onUpdate={handleUpdateElement}
          />
        )}

        {/* Right Sidebar - Block Settings (if block selected) */}
        {!isPreview && selectedElement && selectedElement.type === "block" && (
          <div className="w-96 bg-white border-l border-gray-200">
            <BlockSettingsPanel
              block={null} // TODO: Convert to LandingPageBlock format
              onClose={() => setSelectedElementId(null)}
              onUpdate={(block) => {
                // TODO: Update block in structure
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for default block content
function getDefaultContentForBlockType(blockType: BlockType): any {
  const defaults: Record<BlockType, any> = {
    text: { text: "Enter your text here...", alignment: "left", fontSize: "base" },
    image: { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", alt: "Image" },
    video: { url: "", provider: "youtube" },
    gallery: { images: [], layout: "grid", columns: 3 },
    links: { links: [] },
    form: { fields: [{ name: "email", label: "Email", type: "email", required: true }], submitButtonText: "Submit" },
    calendar: { events: [], view: "list" },
    map: { address: "", zoom: 15, showMarker: true },
    menu: { categories: [{ name: "Category 1", items: [] }] },
    testimonials: { testimonials: [], layout: "grid" },
    pricing: { plans: [] },
    faq: { faqs: [] },
    social: { platforms: [], style: "icons" },
    download: { files: [] },
    custom: { html: "" },
  };
  return defaults[blockType] || {};
}
