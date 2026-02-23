"use client";

import { useState, useTransition } from "react";
import { createSmartLink } from "../actions/qr";
import { Sparkles, Download, Loader2, Smartphone } from "lucide-react";

export default function CreateQRForm() {
  const [isPending, startTransition] = useTransition();
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createSmartLink(formData);
        if (result.success) setQrImage(result.qrImageBase64);
      } catch (error) {
        console.error("Failed to create QR:", error);
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