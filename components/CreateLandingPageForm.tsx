"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createLandingPage } from "@/actions/landing-page";
import { Globe, Palette, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import TemplateSelector from "./TemplateSelector";
import { LandingPageTemplate, LandingPageCategory } from "@/types/landing-page";

const THEMES = [
  { value: "default", label: "Default", preview: "bg-gradient-to-br from-blue-50 to-indigo-50" },
  { value: "dark", label: "Dark Mode", preview: "bg-gradient-to-br from-gray-900 to-black" },
  { value: "minimal", label: "Minimal", preview: "bg-white" },
  { value: "gradient", label: "Gradient", preview: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500" },
  { value: "neon", label: "Neon", preview: "bg-black" },
];

export default function CreateLandingPageForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<LandingPageTemplate>("biolink");
  const [selectedCategory, setSelectedCategory] = useState<LandingPageCategory>("general");
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [slug, setSlug] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("template", selectedTemplate);
    formData.set("category", selectedCategory);
    formData.set("theme", selectedTheme);

    startTransition(async () => {
      const result = await createLandingPage(formData);
      if (result.success) {
        toast.success("Landing page created!", {
          description: `Your page is live at /l/${result.slug}`,
        });
        router.push(`/dashboard/pages/${result.pageId}/edit`);
      } else {
        toast.error(result.error || "Failed to create page");
      }
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
      {/* Step 1: Choose Template */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Step 1: Choose Your Template
            </h2>
            <p className="text-sm text-gray-600 mt-1">Select a template that matches your needs</p>
          </div>

          <div className="p-6">
            <TemplateSelector 
              onSelectTemplate={(template, category) => {
                setSelectedTemplate(template);
                setSelectedCategory(category);
              }}
              selectedTemplate={selectedTemplate}
            />
          </div>

          <div className="px-6 pb-6 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!selectedTemplate}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Settings
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configuration */}
      {currentStep === 2 && (
        <>
          {/* Basic Settings */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-green-600" />
                    Step 2: Configure Your Page
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Set up your page details</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change Template
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Slug */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Page URL <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/l/</span>
                  <input
                    type="text"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    required
                    className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium font-mono"
                    placeholder="your-name"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Choose a unique, memorable URL slug</p>
              </div>

              {/* vCard-specific fields (if template is vcard) */}
              {selectedTemplate === "vcard" && (
                <div className="space-y-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h3 className="font-bold text-purple-900">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                        placeholder="Acme Inc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                        placeholder="123 Main St, San Francisco, CA 94102"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo URL</label>
                      <input
                        type="url"
                        name="profilePhotoUrl"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                Step 3: Choose Theme
              </h2>
              <p className="text-sm text-gray-600 mt-1">Select a visual style for your page</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => setSelectedTheme(theme.value)}
                    className={`relative p-4 rounded-2xl border-2 transition-all ${
                      selectedTheme === theme.value
                        ? "border-purple-500 shadow-lg"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className={`w-full aspect-square rounded-xl mb-3 ${theme.preview}`} />
                    <p className="text-sm font-semibold text-gray-900">{theme.label}</p>
                    {selectedTheme === theme.value && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPending || !slug}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create Landing Page"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
