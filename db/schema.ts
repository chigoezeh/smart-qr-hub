import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// TABLE 1: The QR Codes (The "Smart Links")
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  shortCode: text("short_code").notNull().unique(), 
  destinationUrl: text("destination_url").notNull(), 
  title: text("title"), 
  isDynamic: boolean("is_dynamic").default(true).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  iosUrl: text("ios_url"),
  androidUrl: text("android_url"),
});

// TABLE 2: The Analytics (The "Tracker")
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").references(() => qrCodes.id).notNull(), 
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
  os: text("os"), 
  deviceType: text("device_type"), 
  country: text("country"), 
});