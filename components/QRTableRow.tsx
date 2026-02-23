"use client";

import { Copy, ExternalLink, MoreVertical, Eye } from "lucide-react";
import { useState } from "react";

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">QR</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">/q/{shortCode}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
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
      <td className="p-4">
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
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-3">
          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm font-bold">
            {scanCount.toLocaleString()}
          </span>
          <button
            onClick={copyShortLink}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
            title="Copy short link"
          >
            {copied ? (
              <Eye className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
