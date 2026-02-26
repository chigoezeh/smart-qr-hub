CREATE TABLE "landing_page_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"landing_page_id" integer NOT NULL,
	"block_type" text NOT NULL,
	"title" text,
	"content" jsonb NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"background_color" text,
	"text_color" text,
	"custom_styles" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_page_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"landing_page_id" integer NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"message" text,
	"custom_data" jsonb,
	"source_url" text,
	"user_agent" text,
	"ip_address" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"landing_page_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"os" text,
	"device_type" text,
	"country" text,
	"city" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"time_on_page" integer,
	"blocks_viewed" jsonb,
	"links_clicked" jsonb,
	"click_positions" jsonb,
	"custom_events" jsonb,
	"did_convert" boolean DEFAULT false NOT NULL,
	"conversion_type" text
);
--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD COLUMN "link_type" text DEFAULT 'standard';--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD COLUMN "click_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD COLUMN "last_clicked_at" timestamp;--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD COLUMN "is_visible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "category" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "template" text DEFAULT 'biolink' NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "color_primary" text DEFAULT '#3B82F6';--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "color_secondary" text DEFAULT '#8B5CF6';--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "font_family" text DEFAULT 'Inter';--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "meta_image" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "header_type" text DEFAULT 'minimal';--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "header_media_url" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "header_title" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "header_subtitle" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "business_info" jsonb;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "contact_info" jsonb;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "settings_data" jsonb;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "enable_analytics" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "enable_lead_capture" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "enable_appointments" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "enable_payments" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "requires_password" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD COLUMN "landing_page_id" integer;--> statement-breakpoint
ALTER TABLE "landing_page_blocks" ADD CONSTRAINT "landing_page_blocks_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_page_leads" ADD CONSTRAINT "landing_page_leads_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_page_views" ADD CONSTRAINT "landing_page_views_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "landing_page_blocks_landing_page_id_idx" ON "landing_page_blocks" USING btree ("landing_page_id");--> statement-breakpoint
CREATE INDEX "landing_page_blocks_block_type_idx" ON "landing_page_blocks" USING btree ("block_type");--> statement-breakpoint
CREATE INDEX "landing_page_leads_landing_page_id_idx" ON "landing_page_leads" USING btree ("landing_page_id");--> statement-breakpoint
CREATE INDEX "landing_page_leads_email_idx" ON "landing_page_leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "landing_page_leads_status_idx" ON "landing_page_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "landing_page_views_landing_page_id_viewed_at_idx" ON "landing_page_views" USING btree ("landing_page_id","viewed_at");--> statement-breakpoint
CREATE INDEX "landing_pages_category_idx" ON "landing_pages" USING btree ("category");--> statement-breakpoint
CREATE INDEX "landing_pages_template_idx" ON "landing_pages" USING btree ("template");