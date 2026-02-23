"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSmartLink } from "@/actions/qr";
import { Sparkles, Download, Loader2, Smartphone, Clock, Globe2, ArrowLeft, QrCode as QrIcon, Check, AlertCircle, Zap, TrendingUp, Activity } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form values for real-time preview
  const [title, setTitle] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [languageRoutes, setLanguageRoutes] = useState<LanguageRoute[]>([]);

  // Debounced auto-generation
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Validate URL
    if (destinationUrl) {
      try {
        new URL(destinationUrl);
        setIsUrlValid(true);
      } catch {
        setIsUrlValid(false);
      }
    } else {
      setIsUrlValid(null);
    }

    // Auto-generate QR when URL is valid
    if (destinationUrl && isUrlValid) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        autoGenerateQR();
      }, 800);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [destinationUrl, isUrlValid, schedules, languageRoutes]);

  const autoGenerateQR = async () => {
    if (!destinationUrl || !isUrlValid) return;
    
    setIsGenerating(true);
    const formData = new FormData();
    formData.set("title", title || "Untitled QR Code");
    formData.set("destinationUrl", destinationUrl);
    
    // Add schedules if any
    if (schedules.length > 0) {
      const schedulesJson = JSON.stringify(
        schedules.filter((s) => s.url).map(({ id, ...rest }) => rest)
      );
      formData.set("schedules", schedulesJson);
    }
    
    // Add language routes if any
    if (languageRoutes.length > 0) {
      const routesObj = languageRoutes
        .filter((r) => r.url)
        .reduce((acc, route) => {
          acc[route.language] = route.url;
          return acc;
        }, {} as Record<string, string>);
      
      formData.set("languageRoutes", JSON.stringify(routesObj));
    }

    try {
      const result = await createSmartLink(formData);
      if (result.success) {
        setQrImage(result.qrImageBase64);
        setShortCode(result.shortCode);
      }
    } catch (error) {
      console.error("Auto-generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (qrImage && shortCode) {
      toast.success("QR Code ready!", {
        description: `Short code: ${shortCode}`,
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    
    if (schedules.length > 0) {
      const schedulesJson = JSON.stringify(
        schedules.filter((s) => s.url).map(({ id, ...rest }) => rest)
      );
      formData.set("schedules", schedulesJson);
    }
    
    if (languageRoutes.length > 0) {
      const routesObj = languageRoutes
        .filter((r) => r.url)
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
    setTitle("");
    setDestinationUrl("");
    setSchedules([]);
    setLanguageRoutes([]);
    setShowAdvanced(false);
    setShowSchedules(false);
    setShowLanguages(false);
    setIsUrlValid(null);
  };

  const activeRulesCount = schedules.length + languageRoutes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            
            {qrImage && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  QR Code Ready
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Create Smart QR Code
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Auto-generated with real-time preview • Advanced routing & analytics
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Form Inputs (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Basic Information
                    </h2>
                    {isUrlValid && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Valid URL
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Title <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                      placeholder="e.g., Product Launch Campaign"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Give your QR code a memorable name
                      </p>
                      <span className="text-xs text-gray-400 font-mono">
                        {title.length}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Destination URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        name="destinationUrl"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        required
                        className={`w-full rounded-xl border-2 px-4 py-3.5 pr-12 focus:ring-4 transition-all text-gray-900 font-medium placeholder:text-gray-400 ${
                          isUrlValid === true
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50/30"
                            : isUrlValid === false
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        }`}
                        placeholder="https://example.com"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isUrlValid === true && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        {isUrlValid === false && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Default URL when no smart routing rules apply
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform-Specific URLs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-b border-gray-100 hover:from-blue-100 hover:via-cyan-100 hover:to-blue-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Platform-Specific URLs</h2>
                  </div>
                  <div
                    className={`transform transition-all duration-300 ${
                      showAdvanced ? "rotate-180" : ""
                    }`}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showAdvanced && (
                  <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        iOS Fallback URL
                      </label>
                      <input
                        type="url"
                        name="iosUrl"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                        placeholder="https://apps.apple.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1.5">Redirect iOS users to this URL</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Android Fallback URL
                      </label>
                      <input
                        type="url"
                        name="androidUrl"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                        placeholder="https://play.google.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1.5">Redirect Android users to this URL</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Time-Based Routing */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setShowSchedules(!showSchedules)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-b border-gray-100 hover:from-purple-100 hover:via-pink-100 hover:to-purple-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-gray-800">Time-Based Routing</h2>
                      <p className="text-xs text-gray-600 font-medium">Route by day of week and time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {schedules.length > 0 && (
                      <span className="px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold shadow-lg shadow-purple-500/30">
                        {schedules.length} {schedules.length === 1 ? "rule" : "rules"}
                      </span>
                    )}
                    <div
                      className={`transform transition-all duration-300 ${
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
                  <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <ScheduleBuilder schedules={schedules} onChange={setSchedules} />
                  </div>
                )}
              </div>

              {/* Language-Based Routing */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-b border-gray-100 hover:from-green-100 hover:via-emerald-100 hover:to-green-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                      <Globe2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-gray-800">Language-Based Routing</h2>
                      <p className="text-xs text-gray-600 font-medium">Route by browser language preference</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {languageRoutes.length > 0 && (
                      <span className="px-3 py-1.5 bg-green-600 text-white rounded-full text-xs font-bold shadow-lg shadow-green-500/30">
                        {languageRoutes.length} {languageRoutes.length === 1 ? "language" : "languages"}
                      </span>
                    )}
                    <div
                      className={`transform transition-all duration-300 ${
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
                  <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <LanguageRouteBuilder routes={languageRoutes} onChange={setLanguageRoutes} />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Live Preview Sidebar (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Live QR Preview */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <QrIcon className="w-5 h-5 text-indigo-600" />
                      Live Preview
                    </h3>
                  </div>
                  
                  <div className="p-8">
                    {isGenerating ? (
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                          <p className="text-sm font-semibold text-gray-600">Generating...</p>
                        </div>
                      </div>
                    ) : qrImage ? (
                      <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-2xl p-4 shadow-xl border-4 border-gray-100 hover:border-purple-200 transition-all">
                          <img
                            src={qrImage}
                            alt="Generated QR"
                            className="w-full h-full rounded-xl"
                          />
                        </div>
                        
                        {shortCode && (
                          <div className="space-y-3">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                              <p className="text-xs font-bold text-green-700 mb-1">Short Code</p>
                              <p className="text-lg font-black text-green-900 font-mono">{shortCode}</p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                              <p className="text-xs font-bold text-blue-700 mb-2">Short URL</p>
                              <code className="text-xs bg-white px-2 py-1.5 rounded-lg text-blue-900 font-mono block truncate border border-blue-300">
                                {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/q/{shortCode}
                              </code>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center px-6">
                          <QrIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm font-semibold text-gray-600 mb-1">No QR Code Yet</p>
                          <p className="text-xs text-gray-500">
                            Enter a valid URL to auto-generate
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Configuration
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Rules</span>
                        <span className="text-2xl font-black">{activeRulesCount}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Time Schedules</span>
                        <span className="text-2xl font-black">{schedules.length}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Languages</span>
                        <span className="text-2xl font-black">{languageRoutes.length}</span>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <span className="text-lg font-bold">
                          {isUrlValid ? "✓ Ready" : "⚠ Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {qrImage && shortCode && (
                  <div className="space-y-3">
                    <a
                      href={qrImage}
                      download={`qr-${shortCode}.png`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download QR Code
                    </a>
                    
                    <Link
                      href={`/dashboard/analytics/${shortCode}`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all"
                    >
                      <Activity className="w-5 h-5" />
                      View Analytics
                    </Link>
                    
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
                    >
                      Create Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
