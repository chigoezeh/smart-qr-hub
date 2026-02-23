"use client";

import { Copy, ExternalLink, Eye, BarChart3, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { QRContentType } from "@/types/qr-content";
import QRTypeBadge from "./QRTypeBadge";

interface QRTableRowProps {
  id: number;
  title: string;
  shortCode: string;
  destinationUrl: string;
  contentType: QRContentType;
  status: string;
  scanCount: number;
}

export default function QRTableRow({
  id,
  title,
  shortCode,
  destinationUrl,
  contentType,
  status,
  scanCount,
}: QRTableRowProps) {
  const [copied, setCopied] = useState(false);

  const copyShortLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${baseUrl}/q/${shortCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!", {
      description: link,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200 group border-b border-gray-100 last:border-0">
      <td className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white text-xs sm:text-sm font-bold">QR</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
              {title}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1 truncate">
              /q/{shortCode}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 sm:p-5">
        <QRTypeBadge type={contentType} variant="compact" />
      </td>
      <td className="p-4 sm:p-5 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <a
            href={destinationUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:text-purple-600 hover:underline truncate max-w-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="truncate">{destinationUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          </a>
        </div>
      </td>
      <td className="p-4 sm:p-5">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
            status === "active"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
              : status === "paused"
              ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border border-yellow-200"
              : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              status === "active"
                ? "bg-green-500 animate-pulse"
                : status === "paused"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          ></span>
          <span className="capitalize">{status}</span>
        </span>
      </td>
      <td className="p-4 sm:p-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 shadow-sm">
            <span className="text-green-700 text-sm font-bold">
              {scanCount.toLocaleString()}
            </span>
            <span className="text-xs text-green-600 font-medium hidden sm:inline">
              scans
            </span>
          </div>

          <a
            href={`${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/q/${shortCode}`}
            target="_blank"
            rel="noreferrer"
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-200"
            title="Test QR Link"
          >
            <ExternalLinkIcon className="w-4 h-4 text-gray-600 hover:text-green-600" />
          </a>

          <Link
            href={`/dashboard/analytics/${id}`}
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-all px-3 py-2 hover:bg-blue-50 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 border border-transparent hover:border-blue-200"
            title="View Analytics"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden xl:inline">Analytics</span>
          </Link>

          <button
            onClick={copyShortLink}
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 hover:bg-purple-50 rounded-lg border border-transparent hover:border-purple-200"
            title="Copy short link"
          >
            {copied ? (
              <Eye className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600 hover:text-purple-600" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
