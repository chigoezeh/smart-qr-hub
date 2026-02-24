"use client";

import { useState, useEffect } from "react";
import { Zap, Download, Loader2, CheckCircle2 } from "lucide-react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface BulkQRGeneratorProps {
  pageId: number;
  pageSlug: string;
}

interface QRVariant {
  id: string;
  name: string;
  utm: string;
  generated: boolean;
}

export default function BulkQRGenerator({ pageId, pageSlug }: BulkQRGeneratorProps) {
  const [pageTitle, setPageTitle] = useState(pageSlug);
  const [variants, setVariants] = useState<QRVariant[]>([
    { id: "1", name: "Social Media", utm: "utm_source=social&utm_medium=qr", generated: false },
    { id: "2", name: "Print Materials", utm: "utm_source=print&utm_medium=qr", generated: false },
    { id: "3", name: "Email Campaign", utm: "utm_source=email&utm_medium=qr", generated: false },
  ]);
  const [customVariant, setCustomVariant] = useState({ name: "", utm: "" });
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch page title
  useEffect(() => {
    fetch(`/api/v1/pages/${pageId}`)
      .then(res => res.json())
      .then(data => {
        if (data.page) {
          setPageTitle(data.page.headerTitle || data.page.slug);
        }
      })
      .catch(console.error);
  }, [pageId]);

  const addVariant = () => {
    if (!customVariant.name || !customVariant.utm) return;
    
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        name: customVariant.name,
        utm: customVariant.utm,
        generated: false,
      },
    ]);
    setCustomVariant({ name: "", utm: "" });
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const generateAndDownloadAll = async () => {
    setIsGenerating(true);
    const zip = new JSZip();

    try {
      for (const variant of variants) {
        // Create QR code in database
        const response = await fetch("/api/v1/qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${pageTitle} - ${variant.name}`,
            contentType: "landing_page",
            contentData: {
              landingPageId: pageId,
              slug: pageSlug,
              utm: variant.utm,
            },
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          const qrUrl = `${window.location.origin}/q/${data.shortCode}?${variant.utm}`;
          
          // Generate QR code image
          const qrDataUrl = await QRCode.toDataURL(qrUrl, {
            width: 1024,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });

          // Convert to blob and add to zip
          const blob = await fetch(qrDataUrl).then(r => r.blob());
          zip.file(`${variant.name.replace(/[^a-z0-9]/gi, '_')}_QR.png`, blob);

          // Mark as generated
          setVariants(prev => prev.map(v => 
            v.id === variant.id ? { ...v, generated: true } : v
          ));
        }
      }

      // Download zip
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${pageSlug}_QR_Codes.zip`);
    } catch (error) {
      console.error("Failed to generate QR codes:", error);
      alert("Failed to generate QR codes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-violet-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bulk QR Code Generator</h3>
            <p className="text-sm text-gray-600">Create multiple QR codes with different UTM parameters</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Variants List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">QR Code Variants</h4>
          <div className="space-y-2">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-gray-900">{variant.name}</h5>
                    {variant.generated && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-mono">{variant.utm}</p>
                </div>
                <button
                  onClick={() => removeVariant(variant.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Variant */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-gray-900 mb-3">Add Custom Variant</h4>
          <div className="space-y-2">
            <input
              type="text"
              value={customVariant.name}
              onChange={(e) => setCustomVariant({ ...customVariant, name: e.target.value })}
              placeholder="Variant name (e.g., 'Billboard Campaign')"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <input
              type="text"
              value={customVariant.utm}
              onChange={(e) => setCustomVariant({ ...customVariant, utm: e.target.value })}
              placeholder="UTM parameters (e.g., 'utm_source=billboard&utm_medium=qr')"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
            />
            <button
              onClick={addVariant}
              disabled={!customVariant.name || !customVariant.utm}
              className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              Add Variant
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateAndDownloadAll}
          disabled={variants.length === 0 || isGenerating}
          className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating {variants.length} QR Codes...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generate & Download All ({variants.length} codes)
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 text-center">
          QR codes will be saved as a ZIP file with UTM tracking enabled
        </div>
      </div>
    </div>
  );
}
