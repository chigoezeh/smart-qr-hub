"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface LanguageRoute {
  id: string;
  language: string;
  languageName: string;
  url: string;
}

interface LanguageRouteBuilderProps {
  routes: LanguageRoute[];
  onChange: (routes: LanguageRoute[]) => void;
}

const COMMON_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "default", name: "Default (Fallback)" },
];

export function LanguageRouteBuilder({
  routes,
  onChange,
}: LanguageRouteBuilderProps) {
  const addRoute = () => {
    const newRoute: LanguageRoute = {
      id: Date.now().toString(),
      language: "en",
      languageName: "English",
      url: "",
    };
    onChange([...routes, newRoute]);
  };

  const removeRoute = (id: string) => {
    onChange(routes.filter((r) => r.id !== id));
  };

  const updateRoute = (id: string, field: keyof LanguageRoute, value: any) => {
    onChange(routes.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleLanguageChange = (id: string, languageCode: string) => {
    const lang = COMMON_LANGUAGES.find((l) => l.code === languageCode);
    if (lang) {
      const route = routes.find((r) => r.id === id);
      if (route) {
        onChange(
          routes.map((r) =>
            r.id === id
              ? { ...r, language: lang.code, languageName: lang.name }
              : r
          )
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      {routes.map((route) => (
        <div
          key={route.id}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-green-900">
              Language Route
            </h4>
            <button
              type="button"
              onClick={() => removeRoute(route.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Language Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={route.language}
                onChange={(e) => handleLanguageChange(route.id, e.target.value)}
                className="w-full rounded-lg border-2 border-green-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                {COMMON_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.code})
                  </option>
                ))}
              </select>
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Redirect URL
              </label>
              <input
                type="url"
                value={route.url}
                onChange={(e) => updateRoute(route.id, "url", e.target.value)}
                placeholder="https://example.com/en"
                className="w-full rounded-lg border-2 border-green-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRoute}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 hover:border-green-400 transition-all font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Language Route
      </button>

      {routes.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-500">
          <p>No language routes configured.</p>
          <p className="text-xs mt-1">
            Add routes to redirect users based on their browser language.
          </p>
        </div>
      )}
    </div>
  );
}
