// QR Code Encoding Utilities
// Converts structured data into QR-scannable format strings

import type {
  QRContentType,
  URLContent,
  LandingPageContent,
  TextContent,
  VCardContent,
  EmailContent,
  SMSContent,
  PhoneContent,
  WiFiContent,
  EventContent,
  LocationContent,
  WhatsAppContent,
  SocialContent,
  CryptoContent,
} from "@/types/qr-content";

/**
 * Encodes content data into QR-scannable format
 */
export function encodeQRContent(
  contentType: QRContentType,
  contentData: any
): string {
  switch (contentType) {
    case "url":
      return encodeURL(contentData);
    case "landing_page":
      return encodeLandingPage(contentData);
    case "text":
      return encodeText(contentData);
    case "vcard":
      return encodeVCard(contentData);
    case "email":
      return encodeEmail(contentData);
    case "sms":
      return encodeSMS(contentData);
    case "phone":
      return encodePhone(contentData);
    case "wifi":
      return encodeWiFi(contentData);
    case "event":
      return encodeEvent(contentData);
    case "location":
      return encodeLocation(contentData);
    case "whatsapp":
      return encodeWhatsApp(contentData);
    case "social":
      return encodeSocial(contentData);
    case "crypto":
      return encodeCrypto(contentData);
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

function encodeURL(data: URLContent): string {
  return data.url;
}

function encodeLandingPage(data: LandingPageContent): string {
  // This will be handled via redirect - return the short code URL
  // The actual redirect logic is in app/q/[shortCode]/route.ts
  // For client-side QR generation, we construct the landing page URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  let baseUrl = `${appUrl}/l/${data.slug}`;
  
  if (data.utm) {
    const utmStr = data.utm.startsWith("?") ? data.utm : `?${data.utm}`;
    baseUrl += utmStr;
  }
  
  return baseUrl;
}

function encodeText(data: TextContent): string {
  return data.text;
}

function encodeVCard(data: VCardContent): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  // Name
  if (data.firstName || data.lastName) {
    lines.push(`N:${data.lastName || ""};${data.firstName || ""};;;`);
    lines.push(`FN:${data.firstName || ""} ${data.lastName || ""}`.trim());
  }

  // Organization & Title
  if (data.organization) {
    lines.push(`ORG:${data.organization}`);
  }
  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  // Contact info
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }
  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }
  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  // Address
  if (data.address) {
    const { street, city, state, zip, country } = data.address;
    lines.push(
      `ADR;TYPE=WORK:;;${street || ""};${city || ""};${state || ""};${
        zip || ""
      };${country || ""}`
    );
  }

  // Note
  if (data.note) {
    lines.push(`NOTE:${data.note}`);
  }

  lines.push("END:VCARD");
  return lines.join("\n");
}

function encodeEmail(data: EmailContent): string {
  const params = new URLSearchParams();
  if (data.subject) params.append("subject", data.subject);
  if (data.body) params.append("body", data.body);

  const query = params.toString();
  return `mailto:${data.email}${query ? `?${query}` : ""}`;
}

function encodeSMS(data: SMSContent): string {
  // iOS uses "sms:", Android uses "smsto:"
  // Modern QR readers handle both, but "sms:" is more universal
  if (data.message) {
    return `sms:${data.phone}?body=${encodeURIComponent(data.message)}`;
  }
  return `sms:${data.phone}`;
}

function encodePhone(data: PhoneContent): string {
  return `tel:${data.phone}`;
}

function encodeWiFi(data: WiFiContent): string {
  // Format: WIFI:T:WPA;S:mynetwork;P:mypass;H:true;;
  const { ssid, password, encryption, hidden } = data;
  const h = hidden ? "true" : "false";

  // Escape special characters
  const escapedSSID = escapeWiFiString(ssid);
  const escapedPassword = escapeWiFiString(password);

  return `WIFI:T:${encryption};S:${escapedSSID};P:${escapedPassword};H:${h};;`;
}

function escapeWiFiString(str: string): string {
  // Escape special characters in WiFi QR format
  return str.replace(/([\\;,":])/g, "\\$1");
}

function encodeEvent(data: EventContent): string {
  // iCalendar format
  const lines = [
    "BEGIN:VEVENT",
    `SUMMARY:${data.title}`,
    `DTSTART:${formatICalDate(data.startDate)}`,
    `DTEND:${formatICalDate(data.endDate)}`,
  ];

  if (data.location) {
    lines.push(`LOCATION:${data.location}`);
  }
  if (data.description) {
    lines.push(`DESCRIPTION:${data.description}`);
  }
  if (data.url) {
    lines.push(`URL:${data.url}`);
  }

  lines.push("END:VEVENT");
  return lines.join("\n");
}

function formatICalDate(isoDate: string): string {
  // Convert ISO date to iCal format: YYYYMMDDTHHMMSSZ
  return isoDate.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function encodeLocation(data: LocationContent): string {
  // geo: URI scheme
  if (data.name) {
    return `geo:${data.latitude},${data.longitude}?q=${encodeURIComponent(
      data.name
    )}`;
  }
  return `geo:${data.latitude},${data.longitude}`;
}

function encodeWhatsApp(data: WhatsAppContent): string {
  // WhatsApp API format
  const phone = data.phone.replace(/[^\d+]/g, ""); // Remove non-digits except +
  if (data.message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(data.message)}`;
  }
  return `https://wa.me/${phone}`;
}

function encodeSocial(data: SocialContent): string {
  const { platform, username } = data;
  const cleanUsername = username.replace(/^@/, ""); // Remove @ if present

  const platformURLs: Record<typeof platform, string> = {
    instagram: `https://instagram.com/${cleanUsername}`,
    twitter: `https://twitter.com/${cleanUsername}`,
    facebook: `https://facebook.com/${cleanUsername}`,
    linkedin: `https://linkedin.com/in/${cleanUsername}`,
    youtube: `https://youtube.com/@${cleanUsername}`,
    tiktok: `https://tiktok.com/@${cleanUsername}`,
    snapchat: `https://snapchat.com/add/${cleanUsername}`,
  };

  return platformURLs[platform];
}

function encodeCrypto(data: CryptoContent): string {
  const { currency, address, amount, label, message } = data;

  // BIP21 URI scheme
  const params = new URLSearchParams();
  if (amount) params.append("amount", amount.toString());
  if (label) params.append("label", label);
  if (message) params.append("message", message);

  const query = params.toString();
  return `${currency}:${address}${query ? `?${query}` : ""}`;
}

/**
 * Validates content data before encoding
 */
export function validateQRContent(
  contentType: QRContentType,
  contentData: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (contentType) {
    case "url":
      if (!contentData.url) errors.push("URL is required");
      else {
        try {
          new URL(contentData.url);
        } catch {
          errors.push("Invalid URL format");
        }
      }
      break;

    case "landing_page":
      if (!contentData.landingPageId) {
        errors.push("Landing page selection is required");
      }
      if (!contentData.slug) {
        errors.push("Landing page slug is required");
      }
      break;

    case "text":
      if (!contentData.text || contentData.text.trim() === "") {
        errors.push("Text content is required");
      }
      break;

    case "vcard":
      if (!contentData.firstName && !contentData.lastName) {
        errors.push("At least first name or last name is required");
      }
      break;

    case "email":
      if (!contentData.email) {
        errors.push("Email address is required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contentData.email)) {
        errors.push("Invalid email format");
      }
      break;

    case "sms":
    case "phone":
    case "whatsapp":
      if (!contentData.phone) {
        errors.push("Phone number is required");
      }
      break;

    case "wifi":
      if (!contentData.ssid) errors.push("WiFi network name (SSID) is required");
      if (!contentData.password) errors.push("WiFi password is required");
      if (!contentData.encryption) errors.push("Encryption type is required");
      break;

    case "event":
      if (!contentData.title) errors.push("Event title is required");
      if (!contentData.startDate) errors.push("Start date is required");
      if (!contentData.endDate) errors.push("End date is required");
      break;

    case "location":
      if (contentData.latitude === undefined || contentData.latitude === null) {
        errors.push("Latitude is required");
      }
      if (contentData.longitude === undefined || contentData.longitude === null) {
        errors.push("Longitude is required");
      }
      break;

    case "social":
      if (!contentData.platform) errors.push("Social platform is required");
      if (!contentData.username) errors.push("Username is required");
      break;

    case "crypto":
      if (!contentData.currency) errors.push("Cryptocurrency is required");
      if (!contentData.address) errors.push("Wallet address is required");
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
