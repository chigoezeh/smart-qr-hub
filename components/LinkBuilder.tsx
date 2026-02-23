"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ExternalLink, Trash2, Edit2, Plus } from "lucide-react";
import { addPageLink, updatePageLink, deletePageLink, reorderLinks } from "@/actions/landing-page";
import { getSocialIcon, getPlatformName } from "@/lib/social-icons";

interface Link {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  displayOrder: number;
}

interface LinkBuilderProps {
  pageId: number;
  initialLinks: Link[];
}

function SortableLink({
  link,
  onEdit,
  onDelete,
}: {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {link.icon && <span className="text-xl">{link.icon}</span>}
          <h3 className="font-medium text-gray-900 truncate">{link.title}</h3>
        </div>
        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {link.url}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LinkBuilder({ pageId, initialLinks }: LinkBuilderProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({ title: "", url: "", icon: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-detect social media icon from URL
  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, url });
    
    // Auto-detect icon if user hasn't manually set one
    if (!formData.icon || formData.icon === "") {
      const detectedIcon = getSocialIcon(url);
      const platformName = getPlatformName(url);
      
      if (detectedIcon) {
        setFormData({ ...formData, url, icon: detectedIcon });
        setDetectedPlatform(platformName);
      } else {
        setDetectedPlatform(null);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // Update display order in database
      const linkIds = newLinks.map((link) => link.id);
      await reorderLinks(pageId, linkIds);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("url", formData.url);
      formDataObj.append("icon", formData.icon);

      const result = await addPageLink(pageId, formDataObj);
      if (result.success && result.link) {
        setLinks([...links, result.link]);
        setFormData({ title: "", url: "", icon: "" });
        setIsAddingLink(false);
      }
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("url", formData.url);
      formDataObj.append("icon", formData.icon);

      const result = await updatePageLink(editingLink.id, formDataObj);
      if (result.success && result.link) {
        setLinks(links.map((link) => (link.id === editingLink.id ? result.link! : link)));
        setFormData({ title: "", url: "", icon: "" });
        setEditingLink(null);
      }
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const result = await deletePageLink(linkId);
      if (result.success) {
        setLinks(links.filter((link) => link.id !== linkId));
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const startEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({ title: link.title, url: link.url, icon: link.icon || "" });
    setIsAddingLink(false);
  };

  const cancelForm = () => {
    setIsAddingLink(false);
    setEditingLink(null);
    setFormData({ title: "", url: "", icon: "" });
    setDetectedPlatform(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Links</h3>
          <p className="text-sm text-gray-500">Drag to reorder, click to edit</p>
        </div>
        {!isAddingLink && !editingLink && (
          <button
            onClick={() => setIsAddingLink(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingLink || editingLink) && (
        <form onSubmit={editingLink ? handleUpdateLink : handleAddLink} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">{editingLink ? "Edit Link" : "Add New Link"}</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Website"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              required
            />
            {detectedPlatform && (
              <p className="mt-1 text-xs text-green-600">
                ✓ Detected {detectedPlatform} - Icon auto-filled
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (emoji)
              <span className="text-xs text-gray-500 ml-2">Auto-detected for popular platforms</span>
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="🌐"
              maxLength={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Saving..." : editingLink ? "Update Link" : "Add Link"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Links List */}
      {links.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {links.map((link) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  onEdit={() => startEdit(link)}
                  onDelete={() => handleDeleteLink(link.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No links yet. Add your first link to get started.</p>
        </div>
      )}
    </div>
  );
}
