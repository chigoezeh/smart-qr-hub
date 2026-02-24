"use client";

import { formatDistanceToNow } from "date-fns";
import { MousePointerClick, MapPin, Smartphone, Globe } from "lucide-react";
import Link from "next/link";

interface RecentScan {
  id: number;
  qrCodeTitle: string | null;
  qrCodeShortCode: string;
  scannedAt: Date;
  country: string | null;
  city: string | null;
  os: string | null;
  deviceType: string | null;
}

interface RecentActivityProps {
  scans: RecentScan[];
}

export default function RecentActivity({ scans }: RecentActivityProps) {
  if (scans.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MousePointerClick className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No scans yet</h3>
        <p className="text-sm text-gray-600">
          Start sharing your QR codes to see scan activity here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600">Latest QR code scans</p>
            </div>
          </div>
          <Link
            href="/dashboard/qr-codes"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View All
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/dashboard/analytics/${scan.qrCodeShortCode}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate block"
                >
                  {scan.qrCodeTitle || "Untitled QR Code"}
                </Link>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <span className="font-mono text-gray-500">/q/{scan.qrCodeShortCode}</span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    {formatDistanceToNow(new Date(scan.scannedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs">
                {scan.city && scan.country && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-medium">{scan.city}, {scan.country}</span>
                  </div>
                )}
                
                {scan.os && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">
                    {scan.deviceType === "mobile" ? (
                      <Smartphone className="w-3.5 h-3.5" />
                    ) : (
                      <Globe className="w-3.5 h-3.5" />
                    )}
                    <span className="font-medium capitalize">{scan.os}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
