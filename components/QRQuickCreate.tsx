"use client";

import { useState } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

interface QRQuickCreateProps {
  pageSlug: string;
  pageTitle: string;
  pageId: number;
}

export default function QRQuickCreate({ pageSlug, pageTitle, pageId }: QRQuickCreateProps) {
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const landingPageUrl = `${window.location.origin}/l/${pageSlug}`;

  const handleCreateQR = async () => {
    setIsCreating(true);
    try {
      // Create QR code via API (using session auth endpoint)
      const response = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `QR for ${pageTitle}`,
          destinationUrl: landingPageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create QR code");
      }

      const data = await response.json();
      setShortCode(data.shortCode);

      // Use the QR image from the API response
      setQrCodeUrl(data.qrImage);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to create QR code:", error);
      alert("Failed to create QR code. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `qr-${pageSlug}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(landingPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleCreateQR}
        disabled={isCreating}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <QrCode className="w-4 h-4" />
        {isCreating ? "Creating..." : "Create QR Code"}
      </button>

      {/* QR Code Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-purple-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                QR Code Created!
              </h3>
              <p className="text-gray-600 mb-6">
                Your QR code for <strong>{pageTitle}</strong> is ready
              </p>

              {/* QR Code Image */}
              <div className="bg-white border-4 border-gray-200 rounded-lg p-4 mb-6 inline-block">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${pageTitle}`}
                  className="w-64 h-64"
                />
              </div>

              {/* Landing Page URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landing Page URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={landingPageUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Short Code */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Short Code:</strong>{" "}
                  <code className="text-blue-600 font-mono">{shortCode}</code>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Access via: {window.location.origin}/q/{shortCode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                <h4 className="font-medium text-yellow-900 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Print this QR code on business cards, flyers, or posters</li>
                  <li>Add it to your email signature</li>
                  <li>Share it on social media</li>
                  <li>Track scans in the QR analytics dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
