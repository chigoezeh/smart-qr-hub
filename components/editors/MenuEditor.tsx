"use client";

import { MenuBlockContent } from "@/types/landing-page";
import { Plus, Trash2, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MenuEditorProps {
  content: MenuBlockContent;
  onChange: (content: MenuBlockContent) => void;
}

export default function MenuEditor({ content, onChange }: MenuEditorProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const categories = content.categories || [];

  const addCategory = () => {
    onChange({
      ...content,
      categories: [...categories, { name: "New Category", items: [] }],
    });
    setExpandedCategory(categories.length);
  };

  const removeCategory = (categoryIndex: number) => {
    onChange({
      ...content,
      categories: categories.filter((_, i) => i !== categoryIndex),
    });
    if (expandedCategory === categoryIndex) {
      setExpandedCategory(null);
    }
  };

  const updateCategory = (categoryIndex: number, updates: any) => {
    const newCategories = [...categories];
    newCategories[categoryIndex] = { ...newCategories[categoryIndex], ...updates };
    onChange({ ...content, categories: newCategories });
  };

  const addItem = (categoryIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items.push({
      name: "",
      description: "",
      price: "",
    });
    onChange({ ...content, categories: newCategories });
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items = newCategories[categoryIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    onChange({ ...content, categories: newCategories });
  };

  const updateItem = (categoryIndex: number, itemIndex: number, updates: any) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items[itemIndex] = {
      ...newCategories[categoryIndex].items[itemIndex],
      ...updates,
    };
    onChange({ ...content, categories: newCategories });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Menu Categories</h4>
        <button
          onClick={addCategory}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No categories yet</p>
          <p className="text-xs mt-1">Click "Add Category" to create your first menu section</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gray-50 p-3 flex items-center justify-between">
                <button
                  onClick={() =>
                    setExpandedCategory(expandedCategory === categoryIndex ? null : categoryIndex)
                  }
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  {expandedCategory === categoryIndex ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-xs text-gray-500">({category.items.length} items)</span>
                </button>
                <button
                  onClick={() => removeCategory(categoryIndex)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Category Content */}
              {expandedCategory === categoryIndex && (
                <div className="p-4 space-y-4">
                  {/* Category Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(categoryIndex, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Appetizers, Main Course"
                    />
                  </div>

                  {/* Menu Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-700">Menu Items</label>
                      <button
                        onClick={() => addItem(categoryIndex)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Item
                      </button>
                    </div>

                    {category.items.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 border border-dashed border-gray-200 rounded text-xs">
                        No items in this category
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white"
                          >
                            {/* Item Header */}
                            <div className="flex items-start gap-2">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) =>
                                    updateItem(categoryIndex, itemIndex, { name: e.target.value })
                                  }
                                  className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Item name"
                                />
                                <input
                                  type="text"
                                  value={item.price || ""}
                                  onChange={(e) =>
                                    updateItem(categoryIndex, itemIndex, { price: e.target.value })
                                  }
                                  className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Price (e.g., $12.99)"
                                />
                              </div>
                              <button
                                onClick={() => removeItem(categoryIndex, itemIndex)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Description */}
                            <textarea
                              value={item.description || ""}
                              onChange={(e) =>
                                updateItem(categoryIndex, itemIndex, {
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Item description..."
                              rows={2}
                            />

                            {/* Image URL */}
                            <div className="flex gap-2">
                              <ImageIcon className="w-4 h-4 text-gray-400 mt-1.5" />
                              <input
                                type="url"
                                value={item.image || ""}
                                onChange={(e) =>
                                  updateItem(categoryIndex, itemIndex, { image: e.target.value })
                                }
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Image URL (optional)"
                              />
                            </div>

                            {/* Dietary & Allergens */}
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.dietary?.join(", ") || ""}
                                onChange={(e) =>
                                  updateItem(categoryIndex, itemIndex, {
                                    dietary: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  })
                                }
                                className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dietary (vegan, gluten-free)"
                              />
                              <input
                                type="text"
                                value={item.allergens?.join(", ") || ""}
                                onChange={(e) =>
                                  updateItem(categoryIndex, itemIndex, {
                                    allergens: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  })
                                }
                                className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Allergens (nuts, dairy)"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
