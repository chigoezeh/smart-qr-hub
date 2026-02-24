"use client";

import { useState } from "react";
import { LandingPageBlock } from "@/types/landing-page";
import { createBlock, updateBlock, deleteBlock, reorderBlocks, duplicateBlock } from "@/actions/blocks";
import { Plus, GripVertical, Eye, EyeOff, Settings, Copy, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import BlockRenderer from "./blocks/BlockRenderer";
import BlockSettingsPanel from "./BlockSettingsPanel";
import { BLOCK_TYPES, getAllBlockTypes } from "@/lib/block-registry";
import { BlockType } from "@/types/landing-page";

interface PageEditorProps {
  pageId: number;
  initialBlocks: LandingPageBlock[];
  pageSlug: string;
}

export default function PageEditor({ pageId, initialBlocks, pageSlug }: PageEditorProps) {
  const [blocks, setBlocks] = useState<LandingPageBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<number | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const editingBlock = blocks.find(b => b.id === editingBlockId) || null;

  const handleAddBlock = async (blockType: BlockType) => {
    const defaultContent = getDefaultContentForBlockType(blockType);
    
    const result = await createBlock(pageId, {
      blockType,
      title: `New ${BLOCK_TYPES[blockType].name}`,
      content: defaultContent,
    });

    if (result.success && result.block) {
      setBlocks([...blocks, result.block as LandingPageBlock]);
      setShowAddBlock(false);
      toast.success(`${BLOCK_TYPES[blockType].name} block added!`);
    } else {
      toast.error(result.error || "Failed to add block");
    }
  };

  const handleToggleVisibility = async (blockId: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const result = await updateBlock(blockId, {
      isVisible: !block.isVisible,
    });

    if (result.success) {
      setBlocks(blocks.map(b => 
        b.id === blockId ? { ...b, isVisible: !b.isVisible } : b
      ));
      toast.success(block.isVisible ? "Block hidden" : "Block shown");
    } else {
      toast.error(result.error || "Failed to update block");
    }
  };

  const handleDuplicateBlock = async (blockId: number) => {
    const result = await duplicateBlock(blockId);

    if (result.success && result.block) {
      setBlocks([...blocks, result.block as LandingPageBlock]);
      toast.success("Block duplicated!");
    } else {
      toast.error(result.error || "Failed to duplicate block");
    }
  };

  const handleUpdateFromSettings = (updatedBlock: LandingPageBlock) => {
    setBlocks(blocks.map(b => 
      b.id === updatedBlock.id ? updatedBlock : b
    ));
  };

  const handleDeleteBlock = async (blockId: number) => {
    if (!confirm("Are you sure you want to delete this block?")) return;

    const result = await deleteBlock(blockId);

    if (result.success) {
      setBlocks(blocks.filter(b => b.id !== blockId));
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
      toast.success("Block deleted");
    } else {
      toast.error(result.error || "Failed to delete block");
    }
  };

  const handleDragStart = (blockId: number) => {
    setDraggedBlockId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, targetBlockId: number) => {
    e.preventDefault();
    if (draggedBlockId === null || draggedBlockId === targetBlockId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);

    // Update display order
    newBlocks.forEach((block, index) => {
      block.displayOrder = index;
    });

    setBlocks(newBlocks);
  };

  const handleDragEnd = async () => {
    if (draggedBlockId === null) return;

    const blockIds = blocks.map(b => b.id);
    const result = await reorderBlocks(pageId, blockIds);

    if (result.success) {
      toast.success("Blocks reordered!");
    } else {
      toast.error(result.error || "Failed to reorder blocks");
      // Revert on failure
      setBlocks(initialBlocks);
    }

    setDraggedBlockId(null);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Left Panel - Block List */}
      <div className="w-96 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Content Blocks</h3>
            <span className="text-sm text-gray-500">{blocks.length} blocks</span>
          </div>
          <button
            onClick={() => setShowAddBlock(!showAddBlock)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
        </div>

        {/* Add Block Menu */}
        {showAddBlock && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Block Type</h4>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {getAllBlockTypes().map((blockType) => {
                const Icon = blockType.icon;
                return (
                  <button
                    key={blockType.type}
                    onClick={() => handleAddBlock(blockType.type)}
                    className="flex flex-col items-center gap-2 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-white transition-all text-left"
                  >
                    <Icon className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-medium text-gray-900">{blockType.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Block List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {blocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No blocks yet</p>
              <p className="text-xs mt-1">Click "Add Block" to get started</p>
            </div>
          ) : (
            blocks.map((block) => {
              const Icon = BLOCK_TYPES[block.blockType as BlockType]?.icon;
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(block.id)}
                  onDragOver={(e) => handleDragOver(e, block.id)}
                  onDragEnd={handleDragEnd}
                  className={`group p-3 border-2 rounded-lg cursor-move transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  } ${!block.isVisible ? "opacity-50" : ""}`}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    {Icon && <Icon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {block.title || BLOCK_TYPES[block.blockType as BlockType]?.name || "Block"}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {block.blockType}
                      </div>
                    </div>
                  </div>

                  {/* Block Actions */}
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBlockId(block.id);
                      }}
                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Edit block"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(block.id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title={block.isVisible ? "Hide block" : "Show block"}
                    >
                      {block.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateBlock(block.id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Duplicate block"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Preview</h3>
          <a
            href={`/l/${pageSlug}`}
            target="_blank"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Live Page →
          </a>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-2xl mx-auto">
            {blocks.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
                <p className="text-gray-600">Add blocks to start building your page</p>
              </div>
            ) : (
              <div className="space-y-6">
                {blocks
                  .filter(b => b.isVisible)
                  .map((block) => (
                    <div
                      key={block.id}
                      className={`transition-all ${
                        selectedBlockId === block.id
                          ? "ring-2 ring-blue-500 ring-offset-4 rounded-lg"
                          : ""
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <BlockRenderer block={block} isPreview={true} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <BlockSettingsPanel 
        block={editingBlock} 
        onClose={() => setEditingBlockId(null)} 
        onUpdate={handleUpdateFromSettings}
      />
    </div>
  );
}

// Helper function to get default content for each block type
function getDefaultContentForBlockType(blockType: BlockType): any {
  const defaults: Record<BlockType, any> = {
    text: {
      text: "Enter your text here...",
      alignment: "left",
      fontSize: "base",
      fontWeight: "normal",
    },
    image: {
      url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      alt: "Image",
      aspectRatio: "video",
    },
    gallery: {
      images: [],
      layout: "grid",
      columns: 3,
    },
    video: {
      url: "",
      provider: "youtube",
    },
    links: {
      links: [],
    },
    form: {
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
      ],
      submitButtonText: "Submit",
      successMessage: "Thank you for your submission!",
    },
    calendar: {
      events: [],
      view: "list",
    },
    map: {
      address: "",
      zoom: 15,
      showMarker: true,
    },
    menu: {
      categories: [
        { name: "Category 1", items: [] },
      ],
    },
    testimonials: {
      testimonials: [],
      layout: "grid",
    },
    pricing: {
      plans: [],
    },
    faq: {
      faqs: [],
    },
    social: {
      platforms: [],
      style: "icons",
    },
    download: {
      files: [],
    },
    custom: {
      html: "",
    },
  };

  return defaults[blockType] || {};
}
