"use client";

import { useState } from "react";
import { Bot, X, ChevronRight } from "lucide-react";
import AITemplateRecommender from "./AITemplateRecommender";
import ContentAutoPopulator from "./ContentAutoPopulator";
import ImageSuggestionTool from "./ImageSuggestionTool";
import AIMetaGenerator from "./AIMetaGenerator";
import ContentOptimizer from "./ContentOptimizer";

interface AIAssistantPanelProps {
  mode: "create" | "edit";
  pageData?: {
    id?: number;
    title?: string;
    content?: string;
    template?: string;
  };
  workspaceData?: {
    name: string;
    industry: string;
  };
  onTemplateSelect?: (template: string) => void;
  onContentApply?: (content: any) => void;
  onImageSelect?: (imageUrl: string) => void;
  onMetaApply?: (meta: any) => void;
}

type Tab = "recommend" | "content" | "images" | "meta" | "optimize";

export default function AIAssistantPanel({
  mode,
  pageData,
  workspaceData,
  onTemplateSelect,
  onContentApply,
  onImageSelect,
  onMetaApply,
}: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("recommend");

  const tabs = [
    { id: "recommend" as Tab, label: "Template", show: mode === "create" },
    { id: "content" as Tab, label: "Content", show: true },
    { id: "images" as Tab, label: "Images", show: true },
    { id: "meta" as Tab, label: "SEO Meta", show: true },
    { id: "optimize" as Tab, label: "Optimize", show: mode === "edit" },
  ].filter(tab => tab.show);

  return (
    <>
      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <Bot className="w-7 h-7 animate-pulse" />
        )}
        <span className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AI Assistant
        </span>
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[480px] max-h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                  <p className="text-sm text-purple-100">Powered by GPT-4 & Unsplash</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600 bg-white"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "recommend" && mode === "create" && (
              <div className="p-4">
                <AITemplateRecommender
                  onSelectTemplate={(template) => {
                    onTemplateSelect?.(template);
                    setIsOpen(false);
                  }}
                />
              </div>
            )}

            {activeTab === "content" && (
              <div className="p-4">
                <ContentAutoPopulator
                  businessName={workspaceData?.name || "Your Business"}
                  industry={workspaceData?.industry || "General"}
                  template={pageData?.template || "biolink"}
                  onApplyContent={(content) => {
                    onContentApply?.(content);
                  }}
                />
              </div>
            )}

            {activeTab === "images" && (
              <div className="p-4">
                <ImageSuggestionTool
                  businessName={workspaceData?.name || "Your Business"}
                  industry={workspaceData?.industry || "General"}
                  onSelectImage={(imageUrl) => {
                    onImageSelect?.(imageUrl);
                  }}
                />
              </div>
            )}

            {activeTab === "meta" && (
              <div className="p-4">
                <AIMetaGenerator
                  pageTitle={pageData?.title || "Untitled Page"}
                  pageContent={pageData?.content || ""}
                  onApplyMeta={(meta) => {
                    onMetaApply?.(meta);
                  }}
                />
              </div>
            )}

            {activeTab === "optimize" && mode === "edit" && (
              <div className="p-4 space-y-4">
                <ContentOptimizer
                  initialContent=""
                  contentType="headline"
                  onOptimize={(optimized) => {
                    console.log("Optimized headline:", optimized);
                  }}
                />
                <ContentOptimizer
                  initialContent=""
                  contentType="description"
                  onOptimize={(optimized) => {
                    console.log("Optimized description:", optimized);
                  }}
                />
                <ContentOptimizer
                  initialContent=""
                  contentType="cta"
                  onOptimize={(optimized) => {
                    console.log("Optimized CTA:", optimized);
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              AI-generated content may require review before publishing
            </p>
          </div>
        </div>
      )}
    </>
  );
}
