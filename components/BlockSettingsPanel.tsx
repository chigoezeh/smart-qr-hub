"use client";

import { LandingPageBlock, BlockType } from "@/types/landing-page";
import {
  TextBlockContent,
  ImageBlockContent,
  GalleryBlockContent,
  VideoBlockContent,
  FormBlockContent,
  MenuBlockContent,
  TestimonialBlockContent,
  PricingBlockContent,
  FAQBlockContent,
  MapBlockContent,
  SocialBlockContent,
  DownloadBlockContent,
  CalendarBlockContent,
} from "@/types/landing-page";
import { X, Save, Palette, Type, Image as ImageIcon, Link, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { updateBlock } from "@/actions/blocks";
import { toast } from "sonner";
import MenuEditor from "@/components/editors/MenuEditor";
import FormBuilder from "@/components/editors/FormBuilder";
import TestimonialsManager from "@/components/editors/TestimonialsManager";
import PricingBuilder from "@/components/editors/PricingBuilder";
import FAQEditor from "@/components/editors/FAQEditor";
import CalendarEditor from "@/components/editors/CalendarEditor";

interface BlockSettingsPanelProps {
  block: LandingPageBlock | null;
  onClose: () => void;
  onUpdate: (updatedBlock: LandingPageBlock) => void;
}

export default function BlockSettingsPanel({ block, onClose, onUpdate }: BlockSettingsPanelProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: block?.title || "",
    content: block?.content || {},
    backgroundColor: block?.backgroundColor || "",
    textColor: block?.textColor || "",
  });

  if (!block) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateBlock(block.id, {
        title: formData.title,
        content: formData.content,
        backgroundColor: formData.backgroundColor || undefined,
        textColor: formData.textColor || undefined,
      });

      if (result.success && result.block) {
        onUpdate(result.block as LandingPageBlock);
        toast.success("Block updated successfully");
        onClose();
      } else {
        toast.error(result.error || "Failed to update block");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (updates: any) => {
    setFormData({
      ...formData,
      content: { ...formData.content, ...updates },
    });
  };

  const renderContentFields = () => {
    switch (block.blockType) {
      case "text":
        const textContent = formData.content as TextBlockContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={textContent.text || ""}
                onChange={(e) => updateContent({ text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter your text content..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
              <select
                value={textContent.alignment || "left"}
                onChange={(e) => updateContent({ alignment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <select
                value={textContent.fontSize || "base"}
                onChange={(e) => updateContent({ fontSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sm">Small</option>
                <option value="base">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
          </div>
        );

      case "image":
        const imageContent = formData.content as ImageBlockContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={imageContent.url || ""}
                onChange={(e) => updateContent({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={imageContent.alt || ""}
                onChange={(e) => updateContent({ alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
              <input
                type="url"
                value={imageContent.link || ""}
                onChange={(e) => updateContent({ link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case "video":
        const videoContent = formData.content as VideoBlockContent;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={videoContent.url || ""}
                onChange={(e) => updateContent({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="YouTube, Vimeo, or direct video URL"
              />
              <p className="text-xs text-gray-500 mt-1">Supports YouTube, Vimeo, and direct video URLs</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoplay"
                checked={videoContent.autoplay || false}
                onChange={(e) => updateContent({ autoplay: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoplay" className="ml-2 text-sm text-gray-700">Autoplay</label>
            </div>
          </div>
        );

      case "gallery":
        const galleryContent = formData.content as GalleryBlockContent;
        const images = galleryContent.images || [];
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="space-y-2">
                {images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={img.url}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[index] = { ...img, url: e.target.value };
                        updateContent({ images: newImages });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      value={img.caption || ""}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[index] = { ...img, caption: e.target.value };
                        updateContent({ images: newImages });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Caption"
                    />
                    <button
                      onClick={() => {
                        const newImages = images.filter((_, i) => i !== index);
                        updateContent({ images: newImages });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updateContent({ images: [...images, { url: "", caption: "" }] })}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
              <select
                value={galleryContent.layout || "grid"}
                onChange={(e) => updateContent({ layout: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="grid">Grid</option>
                <option value="masonry">Masonry</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>
          </div>
        );

      case "social":
        const socialContent = formData.content as SocialBlockContent;
        const platforms = socialContent.platforms || [];
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Platforms</label>
              <div className="space-y-2">
                {platforms.map((platform: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={platform.name}
                      onChange={(e) => {
                        const newPlatforms = [...platforms];
                        newPlatforms[index] = { ...platform, name: e.target.value };
                        updateContent({ platforms: newPlatforms });
                      }}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Platform name"
                    />
                    <input
                      type="url"
                      value={platform.url}
                      onChange={(e) => {
                        const newPlatforms = [...platforms];
                        newPlatforms[index] = { ...platform, url: e.target.value };
                        updateContent({ platforms: newPlatforms });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://"
                    />
                    <button
                      onClick={() => {
                        const newPlatforms = platforms.filter((_: any, i: number) => i !== index);
                        updateContent({ platforms: newPlatforms });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updateContent({ platforms: [...platforms, { name: "Twitter", url: "" }] })}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Social Platform
                </button>
              </div>
            </div>
          </div>
        );

      case "download":
        const downloadContent = formData.content as DownloadBlockContent;
        const files = downloadContent.files || [];
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Files</label>
              <div className="space-y-2">
                {files.map((file: any, index: number) => (
                  <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={file.name || ""}
                      onChange={(e) => {
                        const newFiles = [...files];
                        newFiles[index] = { ...file, name: e.target.value };
                        updateContent({ files: newFiles });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="File name"
                    />
                    <input
                      type="url"
                      value={file.url || ""}
                      onChange={(e) => {
                        const newFiles = [...files];
                        newFiles[index] = { ...file, url: e.target.value };
                        updateContent({ files: newFiles });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/file.pdf"
                    />
                    <input
                      type="text"
                      value={file.fileSize || ""}
                      onChange={(e) => {
                        const newFiles = [...files];
                        newFiles[index] = { ...file, fileSize: e.target.value };
                        updateContent({ files: newFiles });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="File size (e.g., 2.5 MB)"
                    />
                    <button
                      onClick={() => {
                        const newFiles = files.filter((_: any, i: number) => i !== index);
                        updateContent({ files: newFiles });
                      }}
                      className="w-full px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                    >
                      Remove File
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updateContent({ files: [...files, { name: "", url: "", fileSize: "" }] })}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add File
                </button>
              </div>
            </div>
          </div>
        );

      case "menu":
        return (
          <MenuEditor
            content={formData.content as MenuBlockContent}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          />
        );

      case "form":
        return (
          <FormBuilder
            content={formData.content as FormBlockContent}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          />
        );

      case "calendar":
        return (
          <CalendarEditor
            content={formData.content as CalendarBlockContent}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          />
        );

      case "testimonials":
        return (
          <TestimonialsManager
            content={formData.content as TestimonialBlockContent}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          />
        );

      case "pricing":
        return (
          <PricingBuilder
            content={formData.content as PricingBlockContent}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          />
        );

      case "faq":
        return (
          <FAQEditor
            content={formData.content as FAQBlockContent}
            onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          />
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Content editor for <strong>{block.blockType}</strong> blocks coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Edit {block.blockType.charAt(0).toUpperCase() + block.blockType.slice(1)} Block
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Block Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Block Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional title for this block"
          />
        </div>

        {/* Content Fields */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Content</h4>
          {renderContentFields()}
        </div>

        {/* Styling */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Styling</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.backgroundColor || "#ffffff"}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.backgroundColor || ""}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.textColor || "#000000"}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.textColor || ""}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
