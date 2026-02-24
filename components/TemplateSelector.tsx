"use client";

import { useState } from "react";
import { TEMPLATE_REGISTRY, getAllCategories } from "@/lib/templates";
import { LandingPageCategory, LandingPageTemplate } from "@/types/landing-page";
import { 
  Search, 
  Link2, 
  User, 
  UtensilsCrossed, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Heart, 
  Calendar, 
  GraduationCap, 
  Dumbbell, 
  Plane, 
  Palette,
  Crown,
  Check
} from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: LandingPageTemplate, category: LandingPageCategory) => void;
  selectedTemplate?: LandingPageTemplate;
}

const ICON_MAP: Record<string, any> = {
  Link2,
  User,
  UtensilsCrossed,
  Home,
  Briefcase,
  ShoppingBag,
  Heart,
  Calendar,
  GraduationCap,
  Dumbbell,
  Plane,
  Palette,
};

export default function TemplateSelector({ onSelectTemplate, selectedTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<LandingPageCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getAllCategories();
  const templates = Object.values(TEMPLATE_REGISTRY);

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Templates ({templates.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = ICON_MAP[template.icon] || Briefcase;
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id, template.category)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all group ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-xl scale-105"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white"
              }`}
            >
              {/* Pro Badge */}
              {template.isPro && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
                  <Crown className="w-3 h-3" />
                  PRO
                </div>
              )}

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Template Info */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              {/* Features */}
              <div className="space-y-1.5 mb-4">
                {template.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Recommended For */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Best for:</p>
                <div className="flex flex-wrap gap-1.5">
                  {template.recommendedFor.slice(0, 2).map((rec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}
