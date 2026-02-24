"use client";

import { PricingBlockContent } from "@/types/landing-page";
import { Plus, Trash2, Check, X } from "lucide-react";

interface PricingBuilderProps {
  content: PricingBlockContent;
  onChange: (content: PricingBlockContent) => void;
}

export default function PricingBuilder({ content, onChange }: PricingBuilderProps) {
  const plans = content.plans || [];

  const addPlan = () => {
    onChange({
      ...content,
      plans: [
        ...plans,
        {
          name: "New Plan",
          price: "$0",
          period: "month",
          description: "",
          features: [],
          highlighted: false,
          buttonText: "Get Started",
          buttonUrl: "",
        },
      ],
    });
  };

  const removePlan = (index: number) => {
    onChange({
      ...content,
      plans: plans.filter((_, i) => i !== index),
    });
  };

  const updatePlan = (index: number, updates: any) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], ...updates };
    onChange({ ...content, plans: newPlans });
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features.push("New feature");
    onChange({ ...content, plans: newPlans });
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].features = newPlans[planIndex].features.filter(
      (_, i) => i !== featureIndex
    );
    onChange({ ...content, plans: newPlans });
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...plans];
    newPlans[planIndex].features[featureIndex] = value;
    onChange({ ...content, plans: newPlans });
  };

  return (
    <div className="space-y-4">
      {/* Add Plan Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Pricing Plans</label>
        <button
          onClick={addPlan}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Plan
        </button>
      </div>

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No pricing plans yet</p>
          <p className="text-xs mt-1">Click "Add Plan" to create your first pricing tier</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan, planIndex) => (
            <div
              key={planIndex}
              className={`border rounded-lg p-4 space-y-3 ${
                plan.highlighted
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => updatePlan(planIndex, { name: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Plan Name"
                  />
                </div>
                <button
                  onClick={() => removePlan(planIndex)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Highlighted Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`highlighted-${planIndex}`}
                  checked={plan.highlighted || false}
                  onChange={(e) => updatePlan(planIndex, { highlighted: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`highlighted-${planIndex}`} className="text-xs text-gray-700">
                  Highlight this plan (recommended/popular)
                </label>
              </div>

              {/* Price & Period */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Price</label>
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => updatePlan(planIndex, { price: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="$99"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Period</label>
                  <input
                    type="text"
                    value={plan.period || ""}
                    onChange={(e) => updatePlan(planIndex, { period: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="month, year, one-time"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={plan.description || ""}
                  onChange={(e) => updatePlan(planIndex, { description: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Perfect for individuals..."
                />
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-600">Features</label>
                  <button
                    onClick={() => addFeature(planIndex)}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Feature
                  </button>
                </div>

                {plan.features.length === 0 ? (
                  <div className="text-center py-3 text-gray-400 border border-dashed border-gray-200 rounded text-xs">
                    No features added
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            updateFeature(planIndex, featureIndex, e.target.value)
                          }
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Feature name"
                        />
                        <button
                          onClick={() => removeFeature(planIndex, featureIndex)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Button Settings */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={plan.buttonText || ""}
                    onChange={(e) => updatePlan(planIndex, { buttonText: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Get Started"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Button URL</label>
                  <input
                    type="url"
                    value={plan.buttonUrl || ""}
                    onChange={(e) => updatePlan(planIndex, { buttonUrl: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
