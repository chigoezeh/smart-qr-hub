"use client";

import { QRContentType } from "@/types/qr-content";
import { Globe, FileText, User, Mail, MessageSquare, Phone, Wifi, Calendar, MapPin, MessageCircle, Share2, Coins, Info } from "lucide-react";
import LandingPageSelector from "./LandingPageSelector";

interface QRContentFormsProps {
  contentType: QRContentType;
  contentData: any;
  onChange: (data: any) => void;
}

export default function QRContentForms({ contentType, contentData, onChange }: QRContentFormsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...contentData, [field]: value });
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    onChange({
      ...contentData,
      [parent]: { ...(contentData[parent] || {}), [field]: value },
    });
  };

  switch (contentType) {
    case "url":
      return <URLForm data={contentData} onChange={onChange} />;
    case "landing_page":
      return <LandingPageForm data={contentData} onChange={onChange} />;
    case "text":
      return <TextForm data={contentData} updateField={updateField} />;
    case "vcard":
      return <VCardForm data={contentData} updateField={updateField} updateNestedField={updateNestedField} />;
    case "email":
      return <EmailForm data={contentData} updateField={updateField} />;
    case "sms":
      return <SMSForm data={contentData} updateField={updateField} />;
    case "phone":
      return <PhoneForm data={contentData} updateField={updateField} />;
    case "wifi":
      return <WiFiForm data={contentData} updateField={updateField} />;
    case "event":
      return <EventForm data={contentData} updateField={updateField} />;
    case "location":
      return <LocationForm data={contentData} updateField={updateField} />;
    case "whatsapp":
      return <WhatsAppForm data={contentData} updateField={updateField} />;
    case "social":
      return <SocialForm data={contentData} updateField={updateField} />;
    case "crypto":
      return <CryptoForm data={contentData} updateField={updateField} />;
    default:
      return null;
  }
}

// URL Form
function URLForm({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <FormField
        label="Destination URL"
        icon={Globe}
        required
      >
        <input
          type="url"
          value={data.url || ""}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="https://example.com"
          required
        />
      </FormField>
    </div>
  );
}

// Landing Page Form
function LandingPageForm({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Landing Page <span className="text-red-500">*</span>
        </label>
        <LandingPageSelector
          selectedPageId={data.landingPageId}
          onSelectPage={(pageId, slug) => {
            onChange({ ...data, landingPageId: pageId, slug });
          }}
        />
      </div>
      
      <FormField
        label="UTM Parameters (Optional)"
        icon={Info}
        required={false}
      >
        <input
          type="text"
          value={data.utm || ""}
          onChange={(e) => onChange({ ...data, utm: e.target.value })}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium font-mono text-sm"
          placeholder="utm_source=qr&utm_medium=print&utm_campaign=summer"
        />
        <p className="text-xs text-gray-500 mt-2">
          Add UTM parameters to track this QR code in analytics (without the ? prefix)
        </p>
      </FormField>
    </div>
  );
}

// Text Form
function TextForm({ data, updateField }: any) {
  return (
    <FormField label="Text Content" icon={FileText} required>
      <textarea
        value={data.text || ""}
        onChange={(e) => updateField("text", e.target.value)}
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 transition-all font-medium min-h-[120px]"
        placeholder="Enter any text you want to encode..."
        required
      />
      <p className="text-xs text-gray-500 mt-2">Max recommended: 300 characters</p>
    </FormField>
  );
}

// vCard Form
function VCardForm({ data, updateField, updateNestedField }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" icon={User} required>
          <input
            type="text"
            value={data.firstName || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="John"
            required
          />
        </FormField>
        <FormField label="Last Name">
          <input
            type="text"
            value={data.lastName || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="Doe"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Organization" icon={User}>
          <input
            type="text"
            value={data.organization || ""}
            onChange={(e) => updateField("organization", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="Acme Inc."
          />
        </FormField>
        <FormField label="Job Title">
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="CEO"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Phone" icon={Phone}>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="+1 234 567 8900"
          />
        </FormField>
        <FormField label="Email" icon={Mail}>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="john@example.com"
          />
        </FormField>
      </div>

      <FormField label="Website" icon={Globe}>
        <input
          type="url"
          value={data.website || ""}
          onChange={(e) => updateField("website", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="https://example.com"
        />
      </FormField>

      <FormField label="Address">
        <input
          type="text"
          value={data.address?.street || ""}
          onChange={(e) => updateNestedField("address", "street", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium mb-2"
          placeholder="Street"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={data.address?.city || ""}
            onChange={(e) => updateNestedField("address", "city", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="City"
          />
          <input
            type="text"
            value={data.address?.state || ""}
            onChange={(e) => updateNestedField("address", "state", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="State"
          />
          <input
            type="text"
            value={data.address?.zip || ""}
            onChange={(e) => updateNestedField("address", "zip", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="ZIP"
          />
        </div>
      </FormField>

      <FormField label="Note">
        <textarea
          value={data.note || ""}
          onChange={(e) => updateField("note", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[80px]"
          placeholder="Additional notes..."
        />
      </FormField>
    </div>
  );
}

// Email Form
function EmailForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Email Address" icon={Mail} required>
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="contact@example.com"
          required
        />
      </FormField>
      <FormField label="Subject">
        <input
          type="text"
          value={data.subject || ""}
          onChange={(e) => updateField("subject", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="Email subject"
        />
      </FormField>
      <FormField label="Message Body">
        <textarea
          value={data.body || ""}
          onChange={(e) => updateField("body", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[100px]"
          placeholder="Pre-filled email message..."
        />
      </FormField>
    </div>
  );
}

// SMS Form
function SMSForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Phone Number" icon={MessageSquare} required>
        <input
          type="tel"
          value={data.phone || ""}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="+1 234 567 8900"
          required
        />
      </FormField>
      <FormField label="Pre-filled Message">
        <textarea
          value={data.message || ""}
          onChange={(e) => updateField("message", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[100px]"
          placeholder="Your message here..."
        />
      </FormField>
    </div>
  );
}

// Phone Form
function PhoneForm({ data, updateField }: any) {
  return (
    <FormField label="Phone Number" icon={Phone} required>
      <input
        type="tel"
        value={data.phone || ""}
        onChange={(e) => updateField("phone", e.target.value)}
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
        placeholder="+1 234 567 8900"
        required
      />
      <p className="text-xs text-gray-500 mt-2">Include country code for international numbers</p>
    </FormField>
  );
}

// WiFi Form
function WiFiForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Network Name (SSID)" icon={Wifi} required>
        <input
          type="text"
          value={data.ssid || ""}
          onChange={(e) => updateField("ssid", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="MyWiFiNetwork"
          required
        />
      </FormField>
      <FormField label="Password" required>
        <input
          type="text"
          value={data.password || ""}
          onChange={(e) => updateField("password", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="WiFi password"
          required
        />
      </FormField>
      <FormField label="Security Type" required>
        <select
          value={data.encryption || "WPA"}
          onChange={(e) => updateField("encryption", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          required
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Password</option>
        </select>
      </FormField>
      <FormField label="Hidden Network">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.hidden || false}
            onChange={(e) => updateField("hidden", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span className="text-sm text-gray-700">This is a hidden network</span>
        </label>
      </FormField>
    </div>
  );
}

// Event Form
function EventForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Event Title" icon={Calendar} required>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="Team Meeting"
          required
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date & Time" required>
          <input
            type="datetime-local"
            value={data.startDate || ""}
            onChange={(e) => updateField("startDate", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            required
          />
        </FormField>
        <FormField label="End Date & Time" required>
          <input
            type="datetime-local"
            value={data.endDate || ""}
            onChange={(e) => updateField("endDate", e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            required
          />
        </FormField>
      </div>
      <FormField label="Location">
        <input
          type="text"
          value={data.location || ""}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="Conference Room A"
        />
      </FormField>
      <FormField label="Description">
        <textarea
          value={data.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[80px]"
          placeholder="Event details..."
        />
      </FormField>
    </div>
  );
}

// Location Form
function LocationForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Location Name" icon={MapPin}>
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="Eiffel Tower"
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Latitude" required>
          <input
            type="number"
            step="any"
            value={data.latitude || ""}
            onChange={(e) => updateField("latitude", parseFloat(e.target.value))}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="48.8584"
            required
          />
        </FormField>
        <FormField label="Longitude" required>
          <input
            type="number"
            step="any"
            value={data.longitude || ""}
            onChange={(e) => updateField("longitude", parseFloat(e.target.value))}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            placeholder="2.2945"
            required
          />
        </FormField>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-800 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          You can get coordinates from Google Maps by right-clicking on a location
        </p>
      </div>
    </div>
  );
}

// WhatsApp Form
function WhatsAppForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Phone Number" icon={MessageCircle} required>
        <input
          type="tel"
          value={data.phone || ""}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="+1 234 567 8900"
          required
        />
        <p className="text-xs text-gray-500 mt-2">Include country code (e.g., +1 for US)</p>
      </FormField>
      <FormField label="Pre-filled Message">
        <textarea
          value={data.message || ""}
          onChange={(e) => updateField("message", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[100px]"
          placeholder="Hello! I found you via QR code..."
        />
      </FormField>
    </div>
  );
}

// Social Form
function SocialForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Social Platform" icon={Share2} required>
        <select
          value={data.platform || "instagram"}
          onChange={(e) => updateField("platform", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          required
        >
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter/X</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="snapchat">Snapchat</option>
        </select>
      </FormField>
      <FormField label="Username" required>
        <input
          type="text"
          value={data.username || ""}
          onChange={(e) => updateField("username", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="yourhandle"
          required
        />
        <p className="text-xs text-gray-500 mt-2">Without @ symbol</p>
      </FormField>
    </div>
  );
}

// Crypto Form
function CryptoForm({ data, updateField }: any) {
  return (
    <div className="space-y-4">
      <FormField label="Cryptocurrency" icon={Coins} required>
        <select
          value={data.currency || "bitcoin"}
          onChange={(e) => updateField("currency", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          required
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="litecoin">Litecoin (LTC)</option>
          <option value="dogecoin">Dogecoin (DOGE)</option>
        </select>
      </FormField>
      <FormField label="Wallet Address" required>
        <input
          type="text"
          value={data.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium font-mono text-sm"
          placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
          required
        />
      </FormField>
      <FormField label="Amount (Optional)">
        <input
          type="number"
          step="any"
          value={data.amount || ""}
          onChange={(e) => updateField("amount", parseFloat(e.target.value) || undefined)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="0.001"
        />
      </FormField>
      <FormField label="Label (Optional)">
        <input
          type="text"
          value={data.label || ""}
          onChange={(e) => updateField("label", e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          placeholder="Donation"
        />
      </FormField>
    </div>
  );
}

// Helper components
function FormField({ label, icon: Icon, required, children }: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

