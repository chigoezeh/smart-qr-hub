"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSmartLink } from "@/actions/qr";
import { Sparkles, Download, Loader2, Smartphone, Clock, Globe2, ArrowLeft, QrCode as QrIcon } from "lucide-react";
import { toast } from "sonner";
import { ScheduleBuilder } from "./ScheduleBuilder";
import { LanguageRouteBuilder } from "./LanguageRouteBuilder";
import Link from "next/link";

interface Schedule {
  id: string;
  days: number[];
  startTime: string;
  endTime: string;
  url: string;
}

interface LanguageRoute {
  id: string;
  language: string;
  languageName: string;
  url: string;
}

export default function AdvancedQRForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [shortCode, setShortCode] = useState<string | null>(null);
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [languageRoutes, setLanguageRoutes] = useState<LanguageRoute[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Convert schedules to JSON
    if (schedules.length > 0) {
      const schedulesJson = JSON.stringify(
        schedules
          .filter((s) => s.url) // Only include schedules with URLs
          .map(({ id, ...rest }) => rest) // Remove id field
      );
      formData.set("schedules", schedulesJson);
    }
    
    // Convert language routes to JSON
    if (languageRoutes.length > 0) {
      const routesObj = languageRoutes
        .filter((r) => r.url) // Only include routes with URLs
        .reduce((acc, route) => {
          acc[route.language] = route.url;
          return acc;
        }, {} as Record<string, string>);
      
      formData.set("languageRoutes", JSON.stringify(routesObj));
    }

    startTransition(async () => {
      try {
        const result = await createSmartLink(formData);
        if (result.success) {
          setQrImage(result.qrImageBase64);
          setShortCode(result.shortCode);
          toast.success("QR Code created successfully!", {
            description: `Short code: ${result.shortCode}`,
          });
          
          // Scroll to QR result
          setTimeout(() => {
            document.getElementById("qr-result")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } catch (error) {
        console.error("Failed to create QR:", error);
        toast.error("Failed to create QR code", {
          description: "Please try again or check your inputs.",
        });
      }
    });
  };

  const handleReset = () => {
    setQrImage(null);
    setShortCode(null);
    setSchedules([]);
    setLanguageRoutes([]);
    setShowAdvanced(false);
    setShowSchedules(false);
    setShowLanguages(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Smart QR Code</h1>
              <p className="text-gray-600 mt-1">
                Generate dynamic QR codes with advanced routing and analytics
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Summer Promo Poster, Product Launch"
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
                <p className="text-xs text-gray-500 mt-1.5">
                  Default URL when no smart routing rules apply
                </p>
              </div>
            </div>
          </div>

          {/* Platform-Specific URLs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">Platform-Specific URLs</h2>
              </div>
              <div
                className={`transform transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showAdvanced && (
              <div className="p-6 space-y-4">
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
                  <p className="text-xs text-gray-500 mt-1">Redirect iOS users to this URL</p>
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
                  <p className="text-xs text-gray-500 mt-1">Redirect Android users to this URL</p>
                </div>
              </div>
            )}
          </div>

          {/* Time-Based Routing */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSchedules(!showSchedules)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-100 hover:from-purple-50 hover:to-blue-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-800">Time-Based Routing</h2>
                  <p className="text-xs text-gray-600">Route by day of week and time</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {schedules.length > 0 && (
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {schedules.length} {schedules.length === 1 ? "rule" : "rules"}
                  </span>
                )}
                <div
                  className={`transform transition-transform ${
                    showSchedules ? "rotate-180" : ""
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {showSchedules && (
              <div className="p-6">
                <ScheduleBuilder schedules={schedules} onChange={setSchedules} />
              </div>
            )}
          </div>

          {/* Language-Based Routing */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowLanguages(!showLanguages)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-green-50 border-b border-gray-100 hover:from-green-50 hover:to-emerald-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-800">Language-Based Routing</h2>
                  <p className="text-xs text-gray-600">Route by browser language preference</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {languageRoutes.length > 0 && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {languageRoutes.length} {languageRoutes.length === 1 ? "language" : "languages"}
                  </span>
                )}
                <div
                  className={`transform transition-transform ${
                    showLanguages ? "rotate-180" : ""
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {showLanguages && (
              <div className="p-6">
                <LanguageRouteBuilder routes={languageRoutes} onChange={setLanguageRoutes} />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Smart QR Code
                </>
              )}
            </button>
            {qrImage && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                Create Another
              </button>
            )}
          </div>
        </form>

        {/* QR Result */}
        {qrImage && (
          <div id="qr-result" className="mt-8 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <QrIcon className="w-5 h-5 text-green-600" />
                Your QR Code is Ready!
              </h2>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* QR Code Image */}
                <div className="flex-shrink-0">
                  <div className="p-6 bg-white rounded-2xl shadow-xl border-4 border-gray-100">
                    <img
                      src={qrImage}
                      alt="Generated QR"
                      className="w-64 h-64 rounded-lg"
                    />
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Short Code</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">{shortCode}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Short URL</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-3 py-2 rounded-lg flex-1">
                        {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/q/{shortCode}
                      </code>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <a
                      href={qrImage}
                      download={`qr-${shortCode}.png`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </a>
                    <Link
                      href={`/dashboard/analytics/${shortCode}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                      View Analytics
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
