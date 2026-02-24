import Scanner from "../components/Scanner";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { QrCode, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart-Link Hub
              </span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {userId ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 sm:px-6 sm:py-2.5 text-gray-700 hover:text-gray-900 text-sm sm:text-base font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Enterprise QR Code Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Smart QR Codes for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Brands
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Generate dynamic QR codes with deep analytics, smart routing, and
              enterprise-grade security. Track every scan, route by platform, and
              protect your links.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-base sm:text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                View Demo
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Deep Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-600">Track every scan with location data</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Smart Routing</h3>
                <p className="text-xs sm:text-sm text-gray-600">iOS, Android, time-based URLs</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Secure Links</h3>
                <p className="text-xs sm:text-sm text-gray-600">Password & geo-fencing</p>
              </div>
            </div>
          </div>

          {/* Right Column - Scanner */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Try QR Scanner</h2>
              <p className="text-sm sm:text-base text-gray-600">Scan any QR code to see it in action</p>
            </div>
            <Scanner />
          </div>
        </div>
      </div>
    </div>
  );
}
