"use client";

import { useState, useTransition } from "react";
import { createSmartLink } from "../actions/qr";
import { Sparkles, Download, Loader2, Smartphone, Clock, Globe2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function CreateQRForm() {
  const [isPending, startTransition] = useTransition();
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createSmartLink(formData);
        if (result.success) {
          setQrImage(result.qrImageBase64);
          toast.success("QR Code created successfully!", {
            description: `Short code: ${result.shortCode}`,
          });
        }
      } catch (error) {
        console.error("Failed to create QR:", error);
        toast.error("Failed to create QR code", {
          description: "Please try again or check your inputs.",
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Create Smart Link</h2>
            <p className="text-blue-100 text-sm">Generate dynamic QR codes</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form action={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            name="title"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Summer Promo Poster"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Destination URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="destinationUrl"
            required
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://example.com"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Smartphone className="w-4 h-4" />
          {showAdvanced ? "Hide" : "Show"} Platform-Specific URLs
        </button>

        {/* Advanced Section */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                iOS Fallback URL
              </label>
              <input
                type="url"
                name="iosUrl"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="https://apps.apple.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">Redirect iOS users here instead</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Android Fallback URL
              </label>
              <input
                type="url"
                name="androidUrl"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="https://play.google.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">Redirect Android users here instead</p>
            </div>
          </div>
        )}

        {/* Time-Based Routing Toggle */}
        <button
          type="button"
          onClick={() => setShowSchedules(!showSchedules)}
          className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          <Clock className="w-4 h-4" />
          {showSchedules ? "Hide" : "Show"} Time-Based Routing
        </button>

        {/* Schedules Section */}
        {showSchedules && (
          <div className="pt-4 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-medium mb-2">
                📅 Schedule Format (JSON Array)
              </p>
              <code className="text-xs text-blue-900 block bg-white p-2 rounded overflow-x-auto">
                {`[{"days":[1,2,3,4,5],"startTime":"09:00","endTime":"17:00","url":"https://business.com"}]`}
              </code>
              <p className="text-xs text-blue-700 mt-2">
                Days: 0=Sunday, 6=Saturday. Time in 24h format.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedules (JSON)
              </label>
              <textarea
                name="schedules"
                rows={4}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm font-mono"
                placeholder='[{"days":[1,2,3,4,5],"startTime":"09:00","endTime":"17:00","url":"https://business-hours.com"}]'
              />
            </div>
          </div>
        )}

        {/* Language Routing Toggle */}
        <button
          type="button"
          onClick={() => setShowLanguages(!showLanguages)}
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          <Globe2 className="w-4 h-4" />
          {showLanguages ? "Hide" : "Show"} Language-Based Routing
        </button>

        {/* Language Routes Section */}
        {showLanguages && (
          <div className="pt-4 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800 font-medium mb-2">
                🌍 Language Routes Format (JSON Object)
              </p>
              <code className="text-xs text-green-900 block bg-white p-2 rounded overflow-x-auto">
                {`{"en":"https://english.com","es":"https://spanish.com","default":"https://fallback.com"}`}
              </code>
              <p className="text-xs text-green-700 mt-2">
                Use ISO language codes (en, es, fr, de, etc.)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language Routes (JSON)
              </label>
              <textarea
                name="languageRoutes"
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm font-mono"
                placeholder='{"en":"https://english.com","es":"https://spanish.com","default":"https://fallback.com"}'
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Smart QR
            </>
          )}
        </button>
      </form>

      {/* QR Result */}
      {qrImage && (
        <div className="border-t border-gray-100 p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
              <img
                src={qrImage}
                alt="Generated QR"
                className="w-48 h-48 rounded-lg"
              />
            </div>
            <a
              href={qrImage}
              download="smart-qr.png"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              <Download className="w-4 h-4" />
              Download High-Res PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}