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
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
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
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
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
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  shortCode: text("short_code").notNull().unique(), 
  destinationUrl: text("destination_url"), // Nullable for backward compatibility
  title: text("title"), 
  isDynamic: boolean("is_dynamic").default(true).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // QR Content Type System
  contentType: text("content_type").notNull().default("url"), // url, text, vcard, email, sms, phone, wifi, event, location, whatsapp, social, crypto, landing_page
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
  
  // Landing Page Integration (Phase 8)
  landingPageId: integer("landing_page_id"), // References landing_pages.id (added after landing_pages table creation)
}, (table) => ({
  workspaceIdCreatedAtIdx: index("qr_codes_workspace_id_created_at_idx").on(table.workspaceId, table.createdAt),
  shortCodeIdx: index("qr_codes_short_code_idx").on(table.shortCode),
}));

// TABLE 5: The Analytics (The "Tracker")
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").references(() => qrCodes.id, { onDelete: "cascade" }).notNull(),
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

// TABLE 6: Landing Pages (Universal Smart Landing Platform)
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  slug: text("slug").notNull().unique(),
  
  // Template System
  category: text("category").notNull().default("general"), // general, restaurant, realestate, portfolio, retail, healthcare, events, education, fitness, hospitality, professional, creative, nonprofit
  template: text("template").notNull().default("biolink"), // biolink, vcard, menu, property, resume, product, clinic, event, course, trainer, travel, service, gallery, donation
  type: text("type").notNull().default("biolink"), // Legacy field - kept for backward compatibility
  
  // Theme & Styling
  theme: text("theme").notNull().default("default"),
  customCss: text("custom_css"),
  colorPrimary: text("color_primary").default("#3B82F6"),
  colorSecondary: text("color_secondary").default("#8B5CF6"),
  fontFamily: text("font_family").default("Inter"),
  
  // SEO & Metadata
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaImage: text("meta_image"),
  
  // Header Customization
  headerType: text("header_type").default("minimal"), // minimal, hero, banner, video
  headerMediaUrl: text("header_media_url"),
  headerTitle: text("header_title"),
  headerSubtitle: text("header_subtitle"),
  logoUrl: text("logo_url"),
  
  // Industry-Specific Data (JSONB for flexibility)
  businessInfo: jsonb("business_info"), // {name, tagline, description, industry, etc.}
  contactInfo: jsonb("contact_info"), // {email, phone, address, socialLinks, etc.}
  settingsData: jsonb("settings_data"), // Template-specific settings
  
  // Legacy vCard fields (backward compatibility)
  fullName: text("full_name"),
  phone: text("phone"),
  email: text("email"),
  company: text("company"),
  address: text("address"),
  profilePhotoUrl: text("profile_photo_url"),
  
  // Features & Integrations
  enableAnalytics: boolean("enable_analytics").default(true).notNull(),
  enableLeadCapture: boolean("enable_lead_capture").default(false).notNull(),
  enableAppointments: boolean("enable_appointments").default(false).notNull(),
  enablePayments: boolean("enable_payments").default(false).notNull(),
  
  // Visibility & Access
  isPublished: boolean("is_published").default(true).notNull(),
  requiresPassword: boolean("requires_password").default(false).notNull(),
  passwordHash: text("password_hash"),
  
  // Lead Notification Configuration
  notificationConfig: jsonb("notification_config"), // {notifications: [...], webhookUrl, apiKey, emailService}
  
  // Advanced Page Builder - Hierarchical Structure
  pageStructure: jsonb("page_structure"), // Full tree structure for advanced builder (PageStructure type)
  designTokens: jsonb("design_tokens"), // Global design system tokens (DesignTokens type)
  builderVersion: text("builder_version").default("v1"), // v1 = flat blocks, v2 = hierarchical
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
}, (table) => ({
  workspaceIdIdx: index("landing_pages_workspace_id_idx").on(table.workspaceId),
  categoryIdx: index("landing_pages_category_idx").on(table.category),
  templateIdx: index("landing_pages_template_idx").on(table.template),
}));

// TABLE 7: Landing Page Links (Enhanced Bio-link content)
export const landingPageLinks = pgTable("landing_page_links", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"), // Icon name or emoji
  
  // Link Enhancements
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  linkType: text("link_type").default("standard"), // standard, featured, button, social, download
  
  // Click Tracking
  clickCount: integer("click_count").default(0).notNull(),
  lastClickedAt: timestamp("last_clicked_at"),
  
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  landingPageIdIdx: index("landing_page_links_landing_page_id_idx").on(table.landingPageId),
}));

// TABLE 8: Landing Page Blocks (Modular Content System)
export const landingPageBlocks = pgTable("landing_page_blocks", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id, { onDelete: "cascade" }).notNull(),
  
  blockType: text("block_type").notNull(), // text, image, video, gallery, links, form, calendar, map, menu, testimonials, pricing, faq, social, download, custom
  
  title: text("title"),
  content: jsonb("content").notNull(), // Flexible content data specific to block type
  
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").default(true).notNull(),
  
  // Styling per block
  backgroundColor: text("background_color"),
  textColor: text("text_color"),
  customStyles: jsonb("custom_styles"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  landingPageIdIdx: index("landing_page_blocks_landing_page_id_idx").on(table.landingPageId),
  blockTypeIdx: index("landing_page_blocks_block_type_idx").on(table.blockType),
}));

// TABLE 9: Landing Page Leads (Lead Capture System)
export const landingPageLeads = pgTable("landing_page_leads", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id, { onDelete: "cascade" }).notNull(),
  
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  message: text("message"),
  
  // Custom form fields
  customData: jsonb("custom_data"),
  
  // Tracking
  sourceUrl: text("source_url"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  
  status: text("status").default("new").notNull(), // new, contacted, converted, archived
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  landingPageIdIdx: index("landing_page_leads_landing_page_id_idx").on(table.landingPageId),
  emailIdx: index("landing_page_leads_email_idx").on(table.email),
  statusIdx: index("landing_page_leads_status_idx").on(table.status),
}));

// TABLE 10: Landing Page Views (Analytics System)
export const landingPageViews = pgTable("landing_page_views", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id, { onDelete: "cascade" }).notNull(),
  
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  
  // Device & Location
  os: text("os"),
  deviceType: text("device_type"),
  country: text("country"),
  city: text("city"),
  
  // Source Tracking
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  
  // Engagement
  timeOnPage: integer("time_on_page"), // seconds
  blocksViewed: jsonb("blocks_viewed"), // Array of block IDs
  linksClicked: jsonb("links_clicked"), // Array of link IDs
  clickPositions: jsonb("click_positions"), // Array of {x, y, timestamp} for heatmaps
  customEvents: jsonb("custom_events"), // Array of custom event names
  
  // Conversion
  didConvert: boolean("did_convert").default(false).notNull(),
  conversionType: text("conversion_type"), // lead_form, link_click, download, etc.
}, (table) => ({
  landingPageIdViewedAtIdx: index("landing_page_views_landing_page_id_viewed_at_idx").on(table.landingPageId, table.viewedAt),
}));

// TABLE 11: Landing Page Clicks (Click tracking for bio-links)
export const landingPageClicks = pgTable("landing_page_clicks", {
  id: serial("id").primaryKey(),
  landingPageLinkId: integer("landing_page_link_id").references(() => landingPageLinks.id, { onDelete: "cascade" }).notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
}, (table) => ({
  landingPageLinkIdIdx: index("landing_page_clicks_landing_page_link_id_idx").on(table.landingPageLinkId),
}));

// TABLE 12: Webhooks (Developer integrations)
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
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

// TABLE 13: QR Code Version History (Track destination URL changes)
export const qrCodeVersions = pgTable("qr_code_versions", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").references(() => qrCodes.id, { onDelete: "cascade" }).notNull(),
  destinationUrl: text("destination_url").notNull(),
  changedBy: text("changed_by").notNull(), // Clerk user ID
  changedAt: timestamp("changed_at").defaultNow().notNull(),
}, (table) => ({
  qrCodeIdIdx: index("qr_code_versions_qr_code_id_idx").on(table.qrCodeId),
}));

// ============================================================================
// ADVANCED PAGE BUILDER TABLES
// ============================================================================

// TABLE 14: Page Versions (Version history & undo/redo)
export const pageVersions = pgTable("page_versions", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").references(() => landingPages.id, { onDelete: "cascade" }).notNull(),
  versionNumber: integer("version_number").notNull(),
  pageStructure: jsonb("page_structure").notNull(), // Full PageStructure snapshot
  settings: jsonb("settings"), // Page settings snapshot (theme, colors, etc.)
  changedBy: text("changed_by").notNull(), // Clerk user ID
  changeDescription: text("change_description"), // Optional label like "Before homepage redesign"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  landingPageIdIdx: index("page_versions_landing_page_id_idx").on(table.landingPageId),
  landingPageIdVersionIdx: index("page_versions_landing_page_id_version_idx").on(table.landingPageId, table.versionNumber),
}));

// TABLE 15: Saved Components (Reusable blocks/sections)
export const savedComponents = pgTable("saved_components", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"), // Preview image URL
  componentData: jsonb("component_data").notNull(), // PageElement structure
  category: text("category"), // "hero", "feature", "cta", "testimonial", "pricing", etc.
  tags: jsonb("tags").default([]), // Array of searchable tags
  isPublic: boolean("is_public").default(false).notNull(), // Share across workspace
  createdBy: text("created_by").notNull(), // Clerk user ID
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  workspaceIdIdx: index("saved_components_workspace_id_idx").on(table.workspaceId),
  categoryIdx: index("saved_components_category_idx").on(table.category),
}));

// TABLE 16: Media Library (Asset management)
export const mediaLibrary = pgTable("media_library", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // bytes
  mimeType: text("mime_type").notNull(), // image/jpeg, video/mp4, etc.
  url: text("url").notNull(), // Full CDN URL
  thumbnailUrl: text("thumbnail_url"), // For videos and large images
  width: integer("width"), // For images/videos
  height: integer("height"), // For images/videos
  altText: text("alt_text"),
  tags: jsonb("tags").default([]), // Searchable tags
  folder: text("folder"), // Optional folder organization
  uploadedBy: text("uploaded_by").notNull(), // Clerk user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  workspaceIdIdx: index("media_library_workspace_id_idx").on(table.workspaceId),
  mimeTypeIdx: index("media_library_mime_type_idx").on(table.mimeType),
  folderIdx: index("media_library_folder_idx").on(table.folder),
}));