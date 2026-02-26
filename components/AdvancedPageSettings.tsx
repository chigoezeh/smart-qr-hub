"use client";

import { useState } from "react";
import { Settings2, Mail, Palette, Search, TestTube, QrCode } from "lucide-react";
import FontPicker from "./FontPicker";
import AdvancedCSSEditorV2 from "./AdvancedCSSEditorV2";
import SEOOptimizer from "./SEOOptimizer";
import ABTestingManager from "./ABTestingManager";
import LeadNotificationsConfig from "./LeadNotificationsConfig";
import BulkQRGenerator from "./BulkQRGenerator";

interface AdvancedPageSettingsProps {
  pageId: number;
  pageSlug: string;
}

type Tab = "typography" | "seo" | "notifications" | "abtesting" | "advanced_css" | "qr_codes";

export default function AdvancedPageSettings({ pageId, pageSlug }: AdvancedPageSettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("typography");
  const [selectedFont, setSelectedFont] = useState<string>("Inter");

  const tabs = [
    { id: "typography" as Tab, label: "Typography", icon: Palette },
    { id: "seo" as Tab, label: "SEO & Meta", icon: Search },
    { id: "notifications" as Tab, label: "Lead Notifications", icon: Mail },
    { id: "abtesting" as Tab, label: "A/B Testing", icon: TestTube },
    { id: "qr_codes" as Tab, label: "QR Codes", icon: QrCode },
    { id: "advanced_css" as Tab, label: "Advanced CSS", icon: Settings2 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200  overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "typography" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Typography Settings</h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose a professional font from Google Fonts to enhance your page's appearance
              </p>
              
              <FontPicker
                selectedFont={selectedFont}
                onFontChange={(font) => {
                  setSelectedFont(font);
                  // Save to backend
                  fetch(`/api/pages/${pageId}/settings`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fontFamily: font }),
                  });
                }}
              />

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Preview:</strong> The selected font will be applied to all text on your landing page.
                  You can preview changes by saving and viewing the live page.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO & Social Media</h3>
            <p className="text-sm text-gray-600 mb-6">
              Optimize your page for search engines and social media sharing
            </p>
            
            <SEOOptimizer
              initialData={{}}
              pageSlug={pageSlug}
              onSave={(seoData) => {
                fetch(`/api/pages/${pageId}/seo`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(seoData),
                }).then(() => {
                  console.log("SEO settings saved");
                });
              }}
            />
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Capture Notifications</h3>
            <p className="text-sm text-gray-600 mb-6">
              Get instant email notifications when someone submits a form on your page
            </p>
            
            <LeadNotificationsConfig pageId={pageId} />
          </div>
        )}

        {activeTab === "abtesting" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">A/B Testing & Variants</h3>
            <p className="text-sm text-gray-600 mb-6">
              Create page variants to test different designs and optimize conversion rates
            </p>
            
            <ABTestingManager pageId={pageId} pageSlug={pageSlug} />
          </div>
        )}

        {activeTab === "qr_codes" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate QR Codes</h3>
            <p className="text-sm text-gray-600 mb-6">
              Create multiple QR codes for this landing page with different UTM tracking parameters
            </p>
            
            <BulkQRGenerator pageId={pageId} pageSlug={pageSlug} />
          </div>
        )}

        {activeTab === "advanced_css" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced CSS Styling</h3>
            <p className="text-sm text-gray-600 mb-6">
              Add custom CSS to create unique visual effects and override default styles
            </p>
            
            <AdvancedCSSEditorV2
              blockId={0}
              initialCSS=""
              onSave={(css) => {
                fetch(`/api/pages/${pageId}/custom-css`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ css }),
                }).then(() => {
                  console.log("Custom CSS saved");
                });
              }}
            />

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> Custom CSS can override theme styles. Test thoroughly before publishing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
