"use client";

import { Copy, ExternalLink, MoreVertical, Eye, BarChart3 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface QRTableRowProps {
  id: number;
  title: string;
  shortCode: string;
  destinationUrl: string;
  status: string;
  scanCount: number;
}

export default function QRTableRow({
  id,
  title,
  shortCode,
  destinationUrl,
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
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">QR</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{title}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">/q/{shortCode}</p>
          </div>
        </div>
      </td>
      <td className="p-3 sm:p-4 hidden sm:table-cell">
        <div className="flex items-center gap-2">
          <a
            href={destinationUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline truncate max-w-xs flex items-center gap-1"
          >
            <span className="truncate">{destinationUrl}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      </td>
      <td className="p-3 sm:p-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "paused"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            status === "active" ? "bg-green-500" : status === "paused" ? "bg-yellow-500" : "bg-gray-500"
          }`}></span>
          {status}
        </span>
      </td>
      <td className="p-3 sm:p-4 text-right">
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <span className="inline-flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-xs sm:text-sm font-bold">
            {scanCount.toLocaleString()}
          </span>
          
          <Link
            href={`/dashboard/analytics/${id}`}
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-2 py-1.5 sm:px-3 hover:bg-blue-50 rounded-lg flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-600"
            title="View Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xl:inline">Analytics</span>
          </Link>
          
          <button
            onClick={copyShortLink}
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
            title="Copy short link"
          >
            {copied ? (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
