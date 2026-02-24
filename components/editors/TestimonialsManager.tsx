"use client";

import { TestimonialBlockContent } from "@/types/landing-page";
import { Plus, Trash2, Star, User } from "lucide-react";

interface TestimonialsManagerProps {
  content: TestimonialBlockContent;
  onChange: (content: TestimonialBlockContent) => void;
}

export default function TestimonialsManager({ content, onChange }: TestimonialsManagerProps) {
  const testimonials = content.testimonials || [];

  const addTestimonial = () => {
    onChange({
      ...content,
      testimonials: [
        ...testimonials,
        {
          name: "",
          quote: "",
          role: "",
          company: "",
          avatar: "",
          rating: 5,
        },
      ],
    });
  };

  const removeTestimonial = (index: number) => {
    onChange({
      ...content,
      testimonials: testimonials.filter((_, i) => i !== index),
    });
  };

  const updateTestimonial = (index: number, updates: any) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], ...updates };
    onChange({ ...content, testimonials: newTestimonials });
  };

  return (
    <div className="space-y-4">
      {/* Layout Settings */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Layout Style</label>
        <select
          value={content.layout || "grid"}
          onChange={(e) => onChange({ ...content, layout: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="grid">Grid</option>
          <option value="carousel">Carousel</option>
          <option value="list">List</option>
        </select>
      </div>

      {/* Add Testimonial Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Testimonials</label>
        <button
          onClick={addTestimonial}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No testimonials yet</p>
          <p className="text-xs mt-1">Click "Add Testimonial" to create your first review</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-white space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.name || "Unnamed"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.role || "No role"}{" "}
                      {testimonial.company && `at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeTestimonial(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Name & Avatar */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={testimonial.avatar || ""}
                    onChange={(e) => updateTestimonial(index, { avatar: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Role & Company */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Role/Title</label>
                  <input
                    type="text"
                    value={testimonial.role || ""}
                    onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CEO"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Company</label>
                  <input
                    type="text"
                    value={testimonial.company || ""}
                    onChange={(e) => updateTestimonial(index, { company: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Acme Inc"
                  />
                </div>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Testimonial Quote</label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(index, { quote: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="This product/service is amazing! It helped us..."
                  rows={3}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateTestimonial(index, { rating: star })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= (testimonial.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {testimonial.rating || 0} stars
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
