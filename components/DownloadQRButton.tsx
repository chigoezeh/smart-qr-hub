"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { QRContentType } from "@/types/qr-content";
import { encodeQRContent } from "@/lib/qr-encoder";
import { toast } from "sonner";
import QRCode from "qrcode";

interface DownloadQRButtonProps {
  shortCode: string;
  title: string;
  contentType: QRContentType;
  contentData: any;
  destinationUrl?: string | null;
}

export default function DownloadQRButton({
  shortCode,
  title,
  contentType,
  contentData,
  destinationUrl,
}: DownloadQRButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Determine QR content based on type
      let qrContent: string;
      
      if (contentType === "url") {
        // For URL types, encode the short link
        qrContent = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/q/${shortCode}`;
      } else {
        // For other types (vCard, WiFi, etc.), encode the actual content
        qrContent = encodeQRContent(contentType, contentData);
      }

      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 1024,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });

      // Create download link
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `qr-${shortCode}-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR code downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      toast.error("Failed to download QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-200 disabled:opacity-50"
      title="Download QR Code"
    >
      {isGenerating ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-green-600 rounded-full animate-spin" />
      ) : (
        <Download className="w-4 h-4 text-gray-600 hover:text-green-600" />
      )}
    </button>
  );
}
