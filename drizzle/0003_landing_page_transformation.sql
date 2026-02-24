-- Migration: Landing Page Transformation (Phase 1)
-- Description: Enhance landing pages with template system, blocks, leads, and analytics

-- Step 1: Add new columns to landing_pages table
ALTER TABLE landing_pages 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general',
ADD COLUMN IF NOT EXISTS template TEXT NOT NULL DEFAULT 'biolink',
ADD COLUMN IF NOT EXISTS color_primary TEXT DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS color_secondary TEXT DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_image TEXT,
ADD COLUMN IF NOT EXISTS header_type TEXT DEFAULT 'minimal',
ADD COLUMN IF NOT EXISTS header_media_url TEXT,
ADD COLUMN IF NOT EXISTS header_title TEXT,
ADD COLUMN IF NOT EXISTS header_subtitle TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS business_info JSONB,
ADD COLUMN IF NOT EXISTS contact_info JSONB,
ADD COLUMN IF NOT EXISTS settings_data JSONB,
ADD COLUMN IF NOT EXISTS enable_analytics BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS enable_lead_capture BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS enable_appointments BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS enable_payments BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS requires_password BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

-- Create indexes for new landing_pages columns
CREATE INDEX IF NOT EXISTS landing_pages_category_idx ON landing_pages(category);
CREATE INDEX IF NOT EXISTS landing_pages_template_idx ON landing_pages(template);

-- Step 2: Add new columns to landing_page_links table
ALTER TABLE landing_page_links
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS link_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS click_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;

-- Step 3: Create landing_page_blocks table
CREATE TABLE IF NOT EXISTS landing_page_blocks (
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  background_color TEXT,
  text_color TEXT,
  custom_styles JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS landing_page_blocks_landing_page_id_idx ON landing_page_blocks(landing_page_id);
CREATE INDEX IF NOT EXISTS landing_page_blocks_block_type_idx ON landing_page_blocks(block_type);

-- Step 4: Create landing_page_leads table
CREATE TABLE IF NOT EXISTS landing_page_leads (
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  custom_data JSONB,
  source_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS landing_page_leads_landing_page_id_idx ON landing_page_leads(landing_page_id);
CREATE INDEX IF NOT EXISTS landing_page_leads_email_idx ON landing_page_leads(email);
CREATE INDEX IF NOT EXISTS landing_page_leads_status_idx ON landing_page_leads(status);

-- Step 5: Create landing_page_views table
CREATE TABLE IF NOT EXISTS landing_page_views (
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  os TEXT,
  device_type TEXT,
  country TEXT,
  city TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  time_on_page INTEGER,
  blocks_viewed JSONB,
  links_clicked JSONB,
  did_convert BOOLEAN NOT NULL DEFAULT FALSE,
  conversion_type TEXT
);

CREATE INDEX IF NOT EXISTS landing_page_views_landing_page_id_viewed_at_idx ON landing_page_views(landing_page_id, viewed_at);

-- Step 6: Add landing_page_id to qr_codes table
ALTER TABLE qr_codes
ADD COLUMN IF NOT EXISTS landing_page_id INTEGER REFERENCES landing_pages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS qr_codes_landing_page_id_idx ON qr_codes(landing_page_id);

-- Step 7: Migrate existing landing pages to new template system
-- Set template based on existing type field
UPDATE landing_pages 
SET template = type 
WHERE template = 'biolink';

-- Set published_at for existing published pages
UPDATE landing_pages 
SET published_at = created_at 
WHERE is_published = TRUE AND published_at IS NULL;
