"use client";

import { FAQBlockContent } from "@/types/landing-page";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQEditorProps {
  content: FAQBlockContent;
  onChange: (content: FAQBlockContent) => void;
}

export default function FAQEditor({ content, onChange }: FAQEditorProps) {
  const faqs = content.faqs || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addFAQ = () => {
    onChange({
      ...content,
      faqs: [
        ...faqs,
        {
          question: "",
          answer: "",
        },
      ],
    });
    setExpandedIndex(faqs.length);
  };

  const removeFAQ = (index: number) => {
    onChange({
      ...content,
      faqs: faqs.filter((_, i) => i !== index),
    });
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const updateFAQ = (index: number, updates: any) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], ...updates };
    onChange({ ...content, faqs: newFaqs });
  };

  return (
    <div className="space-y-4">
      {/* Add FAQ Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">FAQ Items</label>
        <button
          onClick={addFAQ}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Question
        </button>
      </div>

      {/* FAQs List */}
      {faqs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No FAQ items yet</p>
          <p className="text-xs mt-1">Click "Add Question" to create your first FAQ</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* FAQ Header */}
              <div className="bg-gray-50 p-3 flex items-center justify-between">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  {expandedIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {faq.question || `Question ${index + 1}`}
                  </span>
                </button>
                <button
                  onClick={() => removeFAQ(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* FAQ Content */}
              {expandedIndex === index && (
                <div className="p-4 space-y-3">
                  {/* Question */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, { question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What is your question?"
                      autoFocus
                    />
                  </div>

                  {/* Answer */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, { answer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide a detailed answer..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          Click on any question to expand and edit
        </p>
      )}
    </div>
  );
}
