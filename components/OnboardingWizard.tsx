"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";

interface OnboardingData {
  industry: string;
  businessName: string;
  description: string;
  primaryGoal: string;
  targetAudience: string;
  features: string[];
}

const INDUSTRIES = [
  { id: "restaurant", name: "Restaurant & Food", icon: "🍽️", template: "menu" },
  { id: "realestate", name: " Real Estate", icon: "🏡", template: "property" },
  { id: "portfolio", name: "Portfolio & Resume", icon: "💼", template: "resume" },
  { id: "retail", name: "Retail & E-commerce", icon: "🛍️", template: "product" },
  { id: "healthcare", name: "Healthcare & Medical", icon: "🏥", template: "clinic" },
  { id: "events", name: "Events & Conferences", icon: "🎫", template: "event" },
  { id: "education", name: "Education & Training", icon: "📚", template: "course" },
  { id: "fitness", name: "Fitness & Wellness", icon: "💪", template: "trainer" },
  { id: "hospitality", name: "Hospitality & Tourism", icon: "✈️", template: "travel" },
  { id: "professional", name: "Professional Services", icon: "💼", template: "service" },
  {id: "creative", name: "Artists & Creators", icon: "🎨", template: "gallery" },
  { id: "nonprofit", name: "Non-Profit & Fundraising", icon: "🤝", template: "donation" },
  { id: "saas", name: "SaaS & Tech", icon: "💻", template: "saas" },
  { id: "general", name: "Other / General", icon: "✨", template: "biolink" },
];

const GOALS = [
  { id: "leads", name: "Generate Leads", description: "Capture contact information and inquiries" },
  { id: "sales", name: "Drive Sales", description: "Showcase products and drive purchases" },
  { id: "awareness", name: "Build Awareness", description: "Share information and grow audience" },
  { id: "bookings", name: "Get Bookings", description: "Schedule appointments and reservations" },
  { id: "engagement", name: "Increase Engagement", description: "Build community and interaction" },
];

const FEATURES = [
  { id: "gallery", name: "Photo Gallery", description: "Showcase images and videos" },
  { id: "forms", name: "Contact Forms", description: "Collect leads and inquiries" },
  { id: "calendar", name: "Event Calendar", description: "Display schedule and events" },
  { id: "testimonials", name: "Testimonials", description: "Social proof from customers" },
  { id: "pricing", name: "Pricing Tables", description: "Show packages and pricing" },
  { id: "faq", name: "FAQ Section", description: "Answer common questions" },
  { id: "social", name: "Social Links", description: "Connect all social profiles" },
  { id: "download", name: "Downloads", description: "Share files and documents" },
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    industry: "",
    businessName: "",
    description: "",
    primaryGoal: "",
    targetAudience: "",
    features: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Get template from selected industry
    const industry = INDUSTRIES.find((i) => i.id === data.industry);
    const template = industry?.template || "biolink";
    
    // Redirect to create page with pre-filled data
    const params = new URLSearchParams({
      template,
      name: data.businessName,
      description: data.description,
      goal: data.primaryGoal,
      features: data.features.join(","),
    });
    
    router.push(`/dashboard/pages/create?${params}`);
  };

  const toggleFeature = (featureId: string) => {
    setData({
      ...data,
      features: data.features.includes(featureId)
        ? data.features.filter((f) => f !== featureId)
        : [...data.features, featureId],
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.industry !== "";
      case 2:
        return data.businessName.trim() !== "";
      case 3:
        return data.primaryGoal !== "";
      case 4:
        return data.features.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 && "What industry are you in?"}
            {step === 2 && "Tell us about your business"}
            {step === 3 && "What's your primary goal?"}
            {step === 4 && "What features do you need?"}
          </h2>
          <p className="text-gray-600 mt-1">
            {step === 1 && "We'll recommend the perfect template for you"}
            {step === 2 && "Help us personalize your landing page"}
            {step === 3 && "We'll optimize your page for this objective"}
            {step === 4 && "Choose the blocks that matter most"}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          {/* Step 1: Industry Selection */}
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setData({ ...data, industry: industry.id })}
                  className={`p-4 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                    data.industry === industry.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{industry.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{industry.name}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business or Page Name *
                </label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  placeholder="e.g., Joe's Pizza, Sarah Martinez Portfolio"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description (Optional)
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="Tell visitors what you do..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience (Optional)
                </label>
                <input
                  type="text"
                  value={data.targetAudience}
                  onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
                  placeholder="e.g., Local families, Tech professionals, Art collectors"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Primary Goal */}
          {step === 3 && (
            <div className="max-w-3xl mx-auto space-y-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setData({ ...data, primaryGoal: goal.id })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                    data.primaryGoal === goal.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{goal.name}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    {data.primaryGoal === goal.id && (
                      <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Features */}
          {step === 4 && (
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                      data.features.includes(feature.id)
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      {data.features.includes(feature.id) && (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Select one or more features you'd like to include
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : step === totalSteps ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create My Page
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
