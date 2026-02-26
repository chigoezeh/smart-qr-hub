"use client";

import { useState } from "react";
import { Split, Plus, Trash2, Eye, Edit2, BarChart3, Copy } from "lucide-react";

interface PageVariant {
  id: string;
  name: string;
  slug: string;
  trafficWeight: number; // Percentage (e.g., 50 for 50%)
  isControl: boolean;
  views: number;
  conversions: number;
  conversionRate: number;
}

interface ABTestingManagerProps {
  pageId: number;
  pageSlug: string;
}

export default function ABTestingManager({ pageId, pageSlug }: ABTestingManagerProps) {
  const [variants, setVariants] = useState<PageVariant[]>([
    {
      id: "control",
      name: "Original (Control)",
      slug: pageSlug,
      trafficWeight: 100,
      isControl: true,
      views: 1543,
      conversions: 87,
      conversionRate: 5.6,
    },
  ]);

  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariantName, setNewVariantName] = useState("");

  const handleAddVariant = () => {
    if (!newVariantName.trim()) return;

    // Adjust traffic weights
    const newWeight = Math.floor(100 / (variants.length + 1));
    const adjustedVariants = variants.map((v) => ({
      ...v,
      trafficWeight: newWeight,
    }));

    const newVariant: PageVariant = {
      id: crypto.randomUUID(),
      name: newVariantName,
      slug: `${pageSlug}-${newVariantName.toLowerCase().replace(/\s+/g, "-")}`,
      trafficWeight: newWeight,
      isControl: false,
      views: 0,
      conversions: 0,
      conversionRate: 0,
    };

    setVariants([...adjustedVariants, newVariant]);
    setNewVariantName("");
    setShowAddVariant(false);
  };

  const handleDeleteVariant = (id: string) => {
    const filtered = variants.filter((v) => v.id !== id);
    // Redistribute traffic
    const newWeight = Math.floor(100 / filtered.length);
    const adjusted = filtered.map((v) => ({
      ...v,
      trafficWeight: newWeight,
    }));
    setVariants(adjusted);
  };

  const handleDuplicateVariant = (id: string) => {
    const original = variants.find((v) => v.id === id);
    if (!original) return;

    const newVariant: PageVariant = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy`,
      views: 0,
      conversions: 0,
      conversionRate: 0,
      isControl: false,
    };

    // Adjust traffic weights
    const newWeight = Math.floor(100 / (variants.length + 1));
    const adjusted = variants.map((v) => ({
      ...v,
      trafficWeight: newWeight,
    }));

    setVariants([...adjusted, newVariant]);
  };

  const updateTrafficWeight = (id: string, weight: number) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, trafficWeight: weight } : v))
    );
  };

  const totalTraffic = variants.reduce((sum, v) => sum + v.trafficWeight, 0);
  const isTrafficBalanced = totalTraffic === 100;

  const getWinner = () => {
    return variants.reduce((prev, current) =>
      current.conversionRate > prev.conversionRate ? current : prev
    );
  };

  const winner = variants.length > 1 ? getWinner() : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Split className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">A/B Testing</h3>
              <p className="text-sm text-gray-600">
                Test different versions to optimize conversions
              </p>
            </div>
          </div>
          {!showAddVariant && variants.length < 5 && (
            <button
              onClick={() => setShowAddVariant(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          )}
        </div>
      </div>

      {/* Add Variant Form */}
      {showAddVariant && (
        <div className="p-6 bg-orange-50 border-b border-orange-200">
          <h4 className="font-medium text-gray-900 mb-3">Create New Variant</h4>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              placeholder="Variant name (e.g., Hero Image Update)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleAddVariant}
              disabled={!newVariantName.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowAddVariant(false);
                setNewVariantName("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Traffic Distribution Warning */}
      {!isTrafficBalanced && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-700">
            ⚠️ Traffic distribution must equal 100%. Current total: {totalTraffic}%
          </p>
        </div>
      )}

      {/* Variants List */}
      <div className="divide-y divide-gray-200">
        {variants.map((variant) => (
          <div key={variant.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{variant.name}</h4>
                  {variant.isControl && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Control
                    </span>
                  )}
                  {winner && variant.id === winner.id && variants.length > 1 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      🏆 Winner
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-mono">/{variant.slug}</p>
              </div>

              {!variant.isControl && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicateVariant(variant.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Duplicate variant"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`/dashboard/pages/${pageId}/edit?variant=${variant.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit variant"
                  >
                    <Edit2 className="w-4 h-4" />
                  </a>
                  <a
                    href={`/l/${variant.slug}`}
                    target="_blank"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview variant"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteVariant(variant.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Traffic Weight Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Traffic Allocation
                </label>
                <span className="text-sm font-semibold text-orange-600">
                  {variant.trafficWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={variant.trafficWeight}
                onChange={(e) =>
                  updateTrafficWeight(variant.id, Number(e.target.value))
                }
                className="w-full accent-orange-600"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Views</p>
                <p className="text-lg font-semibold text-gray-900">
                  {variant.views.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Conversions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {variant.conversions}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Conv. Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {variant.conversionRate}%
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <a
                  href={`/dashboard/pages/${pageId}/analytics?variant=${variant.id}`}
                  className="flex flex-col items-center justify-center h-full hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <BarChart3 className="w-5 h-5 text-orange-600 mb-1" />
                  <span className="text-xs text-orange-600 font-medium">
                    View Stats
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div className="p-6 bg-yellow-50 border-t border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2">💡 How A/B Testing Works:</h4>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Create variant versions of your page with different designs/content</li>
          <li>Set traffic allocation percentage for each variant</li>
          <li>Visitors are randomly shown one variant based on allocation</li>
          <li>Track conversions and compare performance</li>
          <li>After sufficient data, promote the winning variant</li>
        </ol>
      </div>
    </div>
  );
}
