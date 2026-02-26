"use client";

import { useState, useMemo } from "react";
import { Search, Star, TrendingUp, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  category: string;
  template: string;
  description: string;
  previewImage?: string;
  rating: number;
  usageCount: number;
  tags: string[];
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "restaurant-menu",
    name: "Restaurant Menu",
    category: "Restaurant",
    template: "menu",
    description: "Digital menu with categories, photos, pricing, and allergen info",
    rating: 4.8,
    usageCount: 1243,
    tags: ["food", "dining", "menu", "restaurant"],
    isPopular: true,
    isTrending: true,
  },
  {
    id: "real-estate-listing",
    name: "Property Showcase",
    category: "Real Estate",
    template: "property",
    description: "Property gallery with virtual tours, floor plans, and contact info",
    rating: 4.7,
    usageCount: 892,
    tags: ["real estate", "property", "listing"],
    isPopular: true,
  },
  {
    id: "portfolio-resume",
    name: "Interactive Portfolio",
    category: "Portfolio",
    template: "resume",
    description: "Professional portfolio with work history, projects, and skills",
    rating: 4.9,
    usageCount: 2156,
    tags: ["portfolio", "resume", "cv", "professional"],
    isPopular: true,
    isTrending: true,
  },
  {
    id: "retail-product",
    name: "Product Landing",
    category: "Retail",
    template: "product",
    description: "Product showcase with variants, reviews, and purchase links",
    rating: 4.6,
    usageCount: 734,
    tags: ["retail", "ecommerce", "product", "shop"],
  },
  {
    id: "healthcare-clinic",
    name: "Clinic Portal",
    category: "Healthcare",
    template: "clinic",
    description: "Patient resources with appointments, forms, and health tips",
    rating: 4.5,
    usageCount: 456,
    tags: ["healthcare", "medical", "clinic", "doctor"],
    isNew: true,
  },
  {
    id: "event-conference",
    name: "Event Hub",
    category: "Events",
    template: "event",
    description: "Event schedule, speaker bios, venue maps, and registration",
    rating: 4.7,
    usageCount: 987,
    tags: ["events", "conference", "tickets", "meetup"],
    isTrending: true,
  },
  {
    id: "education-course",
    name: "Course Portal",
    category: "Education",
    template: "course",
    description: "Course overview, syllabus, resources, and assignment links",
    rating: 4.6,
    usageCount: 678,
    tags: ["education", "course", "learning", "training"],
  },
  {
    id: "fitness-trainer",
    name: "Trainer Profile",
    category: "Fitness",
    template: "trainer",
    description: "Workout videos, class schedules, nutrition plans, and bookings",
    rating: 4.8,
    usageCount: 543,
    tags: ["fitness", "gym", "wellness", "health"],
    isNew: true,
  },
  {
    id: "travel-guide",
    name: "Travel Guide",
    category: "Hospitality",
    template: "travel",
    description: "Destination highlights, maps, activities, and booking links",
    rating: 4.5,
    usageCount: 421,
    tags: ["travel", "tourism", "hotel", "guide"],
  },
  {
    id: "professional-service",
    name: "Service Provider",
    category: "Professional",
    template: "service",
    description: "Services, pricing, case studies, testimonials, and booking",
    rating: 4.7,
    usageCount: 834,
    tags: ["professional", "services", "consulting", "business"],
  },
  {
    id: "artist-gallery",
    name: "Creative Portfolio",
    category: "Creative",
    template: "gallery",
    description: "Art showcase, exhibitions, commissions, and shop integration",
    rating: 4.9,
    usageCount: 1123,
    tags: ["art", "creative", "gallery", "portfolio"],
    isPopular: true,
  },
  {
    id: "nonprofit-donation",
    name: "Donation Page",
    category: "Nonprofit",
    template: "donation",
    description: "Mission stories, impact metrics, donation buttons, and volunteer signup",
    rating: 4.6,
    usageCount: 567,
    tags: ["nonprofit", "charity", "donation", "fundraising"],
  },
  {
    id: "saas-product",
    name: "SaaS Landing",
    category: "SaaS",
    template: "saas",
    description: "Features, pricing tiers, testimonials, and demo request",
    rating: 4.8,
    usageCount: 1456,
    tags: ["saas", "software", "tech", "startup"],
    isPopular: true,
    isTrending: true,
  },
  {
    id: "basic-biolink",
    name: "Bio Link",
    category: "General",
    template: "biolink",
    description: "Simple link-in-bio with social links and buttons",
    rating: 4.4,
    usageCount: 3245,
    tags: ["bio", "links", "social", "simple"],
    isPopular: true,
  },
  {
    id: "vcard-contact",
    name: "Digital Business Card",
    category: "General",
    template: "vcard",
    description: "Contact info with v Card download and social profiles",
    rating: 4.5,
    usageCount: 2134,
    tags: ["vcard", "contact", "business card", "networking"],
    isPopular: true,
  },
];

const CATEGORIES = [
  "All",
  "General",
  "Restaurant",
  "Real Estate",
  "Portfolio",
  "Retail",
  "Healthcare",
  "Events",
  "Education",
  "Fitness",
  "Hospitality",
  "Professional",
  "Creative",
  "Nonprofit",
  "SaaS",
];

export default function TemplateGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "popular" | "trending" | "new">("all");
  const [sortBy, setSortBy] = useState<"rating" | "usage" | "name">("rating");

  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATES;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Filter by type
    if (selectedFilter === "popular") {
      filtered = filtered.filter((t) => t.isPopular);
    } else if (selectedFilter === "trending") {
      filtered = filtered.filter((t) => t.isTrending);
    } else if (selectedFilter === "new") {
      filtered = filtered.filter((t) => t.isNew);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "usage") return b.usageCount - a.usageCount;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Template
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a professionally designed template tailored to your industry.
              Customize everything to match your brand.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, industries, features..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Templates
            </button>
            <button
              onClick={() => setSelectedFilter("popular")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedFilter === "popular"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Star className="w-4 h-4" />
              Popular
            </button>
            <button
              onClick={() => setSelectedFilter("trending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedFilter === "trending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
            <button
              onClick={() => setSelectedFilter("new")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedFilter === "new"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              New
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="rating">Highest Rated</option>
            <option value="usage">Most Used</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-6">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
        </p>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/dashboard/pages/create?template=${template.template}`}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              {/* Preview Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                <div className="text-4xl opacity-20">{template.name.charAt(0)}</div>
                
                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {template.isPopular && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </span>
                  )}
                  {template.isTrending && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                  {template.isNew && (
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{template.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900">{template.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>{template.usageCount.toLocaleString()} uses</span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Use Template →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
