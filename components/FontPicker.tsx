"use client";

import { useState, useEffect } from "react";
import { Type, Search, Star } from "lucide-react";

interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
  popularity: number;
}

const POPULAR_FONTS: GoogleFont[] = [
  { family: "Inter", category: "sans-serif", variants: ["400", "500", "600", "700"], popularity: 100 },
  { family: "Roboto", category: "sans-serif", variants: ["400", "500", "700"], popularity: 95 },
  { family: "Open Sans", category: "sans-serif", variants: ["400", "600", "700"], popularity: 90 },
  { family: "Lato", category: "sans-serif", variants: ["400", "700"], popularity: 85 },
  { family: "Montserrat", category: "sans-serif", variants: ["400", "500", "600", "700"], popularity: 80 },
  { family: "Poppins", category: "sans-serif", variants: ["400", "500", "600", "700"], popularity: 75 },
  { family: "Playfair Display", category: "serif", variants: ["400", "700"], popularity: 70 },
  { family: "Merriweather", category: "serif", variants: ["400", "700"], popularity: 65 },
  { family: "Raleway", category: "sans-serif", variants: ["400", "600", "700"], popularity: 60 },
  { family: "Ubuntu", category: "sans-serif", variants: ["400", "500", "700"], popularity: 55 },
  { family: "Nunito", category: "sans-serif", variants: ["400", "600", "700"], popularity: 50 },
  { family: "PT Sans", category: "sans-serif", variants: ["400", "700"], popularity: 45 },
  { family: "Source Sans Pro", category: "sans-serif", variants: ["400", "600", "700"], popularity: 40 },
  { family: "Oswald", category: "sans-serif", variants: ["400", "600", "700"], popularity: 35 },
  { family: "Crimson Text", category: "serif", variants: ["400", "600", "700"], popularity: 30 },
];

interface FontPickerProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export default function FontPicker({ selectedFont, onFontChange }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  const filteredFonts = POPULAR_FONTS.filter((font) =>
    font.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadFont = (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return;

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@400;600;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setLoadedFonts((prev) => new Set(prev).add(fontFamily));
  };

  useEffect(() => {
    // Load popular fonts on mount
    POPULAR_FONTS.slice(0, 5).forEach((font) => loadFont(font.family));
  }, []);

  const handleSelectFont = (fontFamily: string) => {
    loadFont(fontFamily);
    onFontChange(fontFamily);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Type className="w-4 h-4 inline mr-1" />
        Font Family
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors bg-white flex items-center justify-between"
        style={{ fontFamily: selectedFont }}
      >
        <span>{selectedFont}</span>
        <Type className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fonts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Font List */}
            <div className="overflow-y-auto max-h-80">
              {filteredFonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleSelectFont(font.family)}
                  onMouseEnter={() => loadFont(font.family)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                    selectedFont === font.family ? "bg-blue-100" : ""
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <div>
                    <div className="font-medium text-gray-900">{font.family}</div>
                    <div className="text-sm text-gray-500 capitalize">{font.category}</div>
                  </div>
                  {selectedFont === font.family && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}

              {filteredFonts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No fonts found</p>
                </div>
              )}
            </div>

            {/* Popular Badge Hint */}
            <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 text-center">
              Showing {filteredFonts.length} popular fonts
            </div>
          </div>
        </>
      )}
    </div>
  );
}
