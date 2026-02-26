"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";

interface TemplateRecommendation {
  template: string;
  confidence: number;
  reasoning: string;
}

interface AITemplateRecommenderProps {
  onSelectTemplate: (template: string) => void;
}

const INDUSTRIES = [
  "Technology", "Healthcare", "Education", "Finance", "Real Estate",
  "E-commerce", "Food & Beverage", "Professional Services", "Entertainment",
  "Non-Profit", "Travel & Tourism", "Fitness & Wellness", "Creative Arts", "Other"
];

const GOALS = [
  "Generate leads", "Build email list", "Showcase portfolio",
  "Book appointments", "Sell products", "Share contact info",
  "Promote events", "Raise funds", "Build brand awareness"
];

export default function AITemplateRecommender({ onSelectTemplate }: AITemplateRecommenderProps) {
  const [industry, setIndustry] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<TemplateRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleGetRecommendation = async () => {
    if (!industry || selectedGoals.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/recommend-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, goals: selectedGoals }),
      });

      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error("Failed to get recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Template Recommender</h3>
            <p className="text-sm text-gray-600">Get personalized template suggestions powered by AI</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What industry are you in?
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Goals Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are your goals? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  selectedGoals.includes(goal)
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Get Recommendation Button */}
        <button
          onClick={handleGetRecommendation}
          disabled={!industry || selectedGoals.length === 0 || isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              Get AI Recommendation
            </>
          )}
        </button>

        {/* Recommendation Result */}
        {recommendation && (
          <div className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-gray-900 capitalize">
                    {recommendation.template.replace("-", " ")}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                    {Math.round(recommendation.confidence * 100)}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  {recommendation.reasoning}
                </p>
                <button
                  onClick={() => onSelectTemplate(recommendation.template)}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
