// QR Code Content Type Definitions

export type QRContentType =
  | "url"
  | "text"
  | "vcard"
  | "email"
  | "sms"
  | "phone"
  | "wifi"
  | "event"
  | "location"
  | "whatsapp"
  | "social"
  | "crypto";

// Content data structures for each type
export interface URLContent {
  url: string;
  // Smart routing only available for URL types
  iosUrl?: string;
  androidUrl?: string;
  schedules?: any[];
  languageRoutes?: Record<string, string>;
}

export interface TextContent {
  text: string;
}

export interface VCardContent {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  note?: string;
}

export interface EmailContent {
  email: string;
  subject?: string;
  body?: string;
}

export interface SMSContent {
  phone: string;
  message?: string;
}

export interface PhoneContent {
  phone: string;
}

export interface WiFiContent {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface EventContent {
  title: string;
  location?: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
  description?: string;
  url?: string;
}

export interface LocationContent {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface WhatsAppContent {
  phone: string;
  message?: string;
}

export interface SocialContent {
  platform: "instagram" | "twitter" | "facebook" | "linkedin" | "youtube" | "tiktok" | "snapchat";
  username: string;
}

export interface CryptoContent {
  currency: "bitcoin" | "ethereum" | "litecoin" | "dogecoin";
  address: string;
  amount?: number;
  label?: string;
  message?: string;
}

export type QRContentData =
  | URLContent
  | TextContent
  | VCardContent
  | EmailContent
  | SMSContent
  | PhoneContent
  | WiFiContent
  | EventContent
  | LocationContent
  | WhatsAppContent
  | SocialContent
  | CryptoContent;

// Type metadata for UI
export interface QRTypeMetadata {
  type: QRContentType;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  supportsSmartRouting: boolean;
}

export const QR_TYPE_METADATA: Record<QRContentType, QRTypeMetadata> = {
  url: {
    type: "url",
    label: "URL/Website",
    description: "Link to any website or web page",
    icon: "Link",
    color: "blue",
    supportsSmartRouting: true,
  },
  text: {
    type: "text",
    label: "Plain Text",
    description: "Any text message or information",
    icon: "FileText",
    color: "gray",
    supportsSmartRouting: false,
  },
  vcard: {
    type: "vcard",
    label: "Contact Card",
    description: "Digital business card (vCard)",
    icon: "User",
    color: "purple",
    supportsSmartRouting: false,
  },
  email: {
    type: "email",
    label: "Email",
    description: "Send an email with pre-filled details",
    icon: "Mail",
    color: "red",
    supportsSmartRouting: false,
  },
  sms: {
    type: "sms",
    label: "SMS/Text Message",
    description: "Send a text message to a phone number",
    icon: "MessageSquare",
    color: "green",
    supportsSmartRouting: false,
  },
  phone: {
    type: "phone",
    label: "Phone Call",
    description: "Dial a phone number instantly",
    icon: "Phone",
    color: "indigo",
    supportsSmartRouting: false,
  },
  wifi: {
    type: "wifi",
    label: "WiFi Network",
    description: "Connect to WiFi automatically",
    icon: "Wifi",
    color: "cyan",
    supportsSmartRouting: false,
  },
  event: {
    type: "event",
    label: "Calendar Event",
    description: "Add event to calendar (iCal)",
    icon: "Calendar",
    color: "orange",
    supportsSmartRouting: false,
  },
  location: {
    type: "location",
    label: "Location/GPS",
    description: "Open location in maps app",
    icon: "MapPin",
    color: "pink",
    supportsSmartRouting: false,
  },
  whatsapp: {
    type: "whatsapp",
    label: "WhatsApp",
    description: "Start WhatsApp chat with message",
    icon: "MessageCircle",
    color: "emerald",
    supportsSmartRouting: false,
  },
  social: {
    type: "social",
    label: "Social Media",
    description: "Link to social media profile",
    icon: "Share2",
    color: "violet",
    supportsSmartRouting: false,
  },
  crypto: {
    type: "crypto",
    label: "Cryptocurrency",
    description: "Bitcoin, Ethereum, or other crypto wallet",
    icon: "Coins",
    color: "amber",
    supportsSmartRouting: false,
  },
};
