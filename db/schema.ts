import { pgTable, serial, text, timestamp, boolean, integer, jsonb, real, index } from "drizzle-orm/pg-core";

// TABLE 1: Workspaces (Multi-tenant isolation)
export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").notNull().default("free"), // free, pro, enterprise
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TABLE 2: Workspace Members (User roles and permissions)
export const workspaceMembers = pgTable("workspace_members", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  userId: text("user_id").notNull(), // Clerk user ID
  role: text("role").notNull().default("member"), // owner, admin, member, viewer
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
  workspaceIdIdx: index("workspace_members_workspace_id_idx").on(table.workspaceId),
  userIdIdx: index("workspace_members_user_id_idx").on(table.userId),
}));

// TABLE 3: API Keys (Developer access)
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  keyHash: text("key_hash").notNull().unique(), // SHA-256 hash of the key
  name: text("name").notNull(), // User-friendly name
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => ({
  workspaceIdIdx: index("api_keys_workspace_id_idx").on(table.workspaceId),
}));

// TABLE 4: The QR Codes (The "Smart Links")
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  shortCode: text("short_code").notNull().unique(), 
  destinationUrl: text("destination_url"), // Nullable for backward compatibility
  title: text("title"), 
  isDynamic: boolean("is_dynamic").default(true).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // QR Content Type System
  contentType: text("content_type").notNull().default("url"), // url, text, vcard, email, sms, phone, wifi, event, location, whatsapp, social, crypto
  contentData: jsonb("content_data"), // Flexible storage for type-specific data
  
  // OS-specific routing
  iosUrl: text("ios_url"),
  androidUrl: text("android_url"),
  
  // Smart Contextual Routing (only for URL types)
  schedules: jsonb("schedules"), // Array of {startTime, endTime, url, timezone}
  languageRoutes: jsonb("language_routes"), // Object like {en: "url", fr: "url"}
  
  // Security & Access Control
  status: text("status").notNull().default("active"), // active, paused, archived
  password: text("password"), // bcrypt hash
  isPasswordProtected: boolean("is_password_protected").default(false).notNull(),
  geofence: jsonb("geofence"), // {latitude, longitude, radiusKm}
  expiresAt: timestamp("expires_at"),
  maxScans: integer("max_scans"),
  currentScans: integer("current_scans").default(0).notNull(),
  
  // Retargeting & Analytics Integration
  facebookPixelId: text("facebook_pixel_id"),
  googleTagManagerId: text("google_tag_manager_id"),
  
  // AI Design (Phase 6)
  designPrompt: text("design_prompt"),
  designImageUrl: text("design_image_url"),
  isArtistic: boolean("is_artistic").default(false).notNull(),
  logoUrl: text("logo_url"),
  foregroundColor: text("foreground_color").default("#000000"),
  backgroundColor: text("background_color").default("#FFFFFF"),
  
  // Barcode Support (Phase 7)
  type: text("type").notNull().default("qr"), // qr, barcode
  barcodeFormat: text("barcode_format"), // UPC, EAN, Code128, etc.
}, (table) => ({
  workspaceIdCreatedAtIdx: index("qr_codes_workspace_id_created_at_idx").on(table.workspaceId, table.createdAt),
  shortCodeIdx: index("qr_codes_short_code_idx").on(table.shortCode),
}));

// TABLE 5: The Analytics (The "Tracker")
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").references(() => qrCodes.id).notNull(), 
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
  
  // Device & OS Detection
  os: text("os"), 
  deviceType: text("device_type"),
  userAgent: text("user_agent"),
  
  // Geolocation (ipapi.com)
  country: text("country"),
  city: text("city"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Referrer & UTM Tracking
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
}, (table) => ({
  qrCodeIdScannedAtIdx: index("scans_qr_code_id_scanned_at_idx").on(table.qrCodeId, table.scannedAt),
}));

// TABLE 6: Landing Pages (Micro-landing page builder)
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("biolink"), // biolink, vcard, custom
  theme: text("theme").notNull().default("default"),
  customCss: text("custom_css"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // vCard specific fields
  fullName: text("full_name"),
  phone: text("phone"),
  email: text("email"),
  company: text("company"),
  address: text("address"),
  profilePhotoUrl: text("profile_photo_url"),
}, (table) => ({
  workspaceIdIdx: index("landing_pages_workspace_id_idx").on(table.workspaceId),
}));

// TABLE 7: Landing Page Links (Bio-link content)
export const landingPageLinks = pgTable("landing_page_links", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id).notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"), // Icon name or emoji
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  landingPageIdIdx: index("landing_page_links_landing_page_id_idx").on(table.landingPageId),
}));

// TABLE 8: Landing Page Clicks (Click tracking for bio-links)
export const landingPageClicks = pgTable("landing_page_clicks", {
  id: serial("id").primaryKey(),
  landingPageLinkId: integer("landing_page_link_id").references(() => landingPageLinks.id).notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
}, (table) => ({
  landingPageLinkIdIdx: index("landing_page_clicks_landing_page_link_id_idx").on(table.landingPageLinkId),
}));

// TABLE 9: Webhooks (Developer integrations)
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id).notNull(),
  url: text("url").notNull(),
  events: jsonb("events").notNull(), // Array of event types like ["qr.scanned", "qr.created"]
  secret: text("secret").notNull(), // For HMAC signing
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSuccessAt: timestamp("last_success_at"),
  lastFailureAt: timestamp("last_failure_at"),
}, (table) => ({
  workspaceIdIdx: index("webhooks_workspace_id_idx").on(table.workspaceId),
}));

// TABLE 10: QR Code Version History (Track destination URL changes)
export const qrCodeVersions = pgTable("qr_code_versions", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").references(() => qrCodes.id).notNull(),
  destinationUrl: text("destination_url").notNull(),
  changedBy: text("changed_by").notNull(), // Clerk user ID
  changedAt: timestamp("changed_at").defaultNow().notNull(),
}, (table) => ({
  qrCodeIdIdx: index("qr_code_versions_qr_code_id_idx").on(table.qrCodeId),
}));