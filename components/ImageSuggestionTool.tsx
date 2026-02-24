"use client";

import { useState } from "react";
import { Image as ImageIcon, Search, Loader2, Download, ExternalLink } from "lucide-react";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
}

interface ImageSuggestionToolProps {
  businessName: string;
  industry: string;
  onSelectImage: (imageUrl: string) => void;
}

export default function ImageSuggestionTool({
  businessName,
  industry,
  onSelectImage,
}: ImageSuggestionToolProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAISearch = async () => {
    setIsSearching(true);
    try {
      // First, get AI-suggested keywords
      const keywordsResponse = await fetch("/api/ai/suggest-image-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, industry, context: searchQuery || industry }),
      });

      const { keywords } = await keywordsResponse.json();
      
      // Use first keyword for search
      if (keywords && keywords.length > 0) {
        await handleSearch(keywords[0]);
      }
    } catch (error) {
      console.error("AI image search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Image search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectImage = (image: UnsplashImage) => {
    setSelectedImage(image.id);
    onSelectImage(image.urls.regular);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-emerald-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Image Suggestions</h3>
            <p className="text-sm text-gray-600">Find perfect images powered by AI + Unsplash</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            placeholder={`Search images for ${industry}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* AI Smart Search */}
        <button
          onClick={handleAISearch}
          disabled={isSearching}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              AI-Powered Smart Search
            </>
          )}
        </button>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => handleSelectImage(image)}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image.id
                    ? "border-emerald-500 ring-2 ring-emerald-500"
                    : "border-transparent hover:border-emerald-300"
                }`}
              >
                <img
                  src={image.urls.small}
                  alt={image.alt_description || "Unsplash image"}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                  <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-white truncate">
                    Photo by {image.user.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            Photos by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Unsplash</a>
          </p>
        )}
      </div>
    </div>
  );
}
