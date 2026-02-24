CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"key_hash" text NOT NULL,
	"name" text NOT NULL,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "landing_page_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"landing_page_link_id" integer NOT NULL,
	"clicked_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"country" text,
	"city" text
);
--> statement-breakpoint
CREATE TABLE "landing_page_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"landing_page_id" integer NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"icon" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"slug" text NOT NULL,
	"type" text DEFAULT 'biolink' NOT NULL,
	"theme" text DEFAULT 'default' NOT NULL,
	"custom_css" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"full_name" text,
	"phone" text,
	"email" text,
	"company" text,
	"address" text,
	"profile_photo_url" text,
	CONSTRAINT "landing_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "qr_code_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"qr_code_id" integer NOT NULL,
	"destination_url" text NOT NULL,
	"changed_by" text NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"short_code" text NOT NULL,
	"destination_url" text NOT NULL,
	"title" text,
	"is_dynamic" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ios_url" text,
	"android_url" text,
	"schedules" jsonb,
	"language_routes" jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"password" text,
	"is_password_protected" boolean DEFAULT false NOT NULL,
	"geofence" jsonb,
	"expires_at" timestamp,
	"max_scans" integer,
	"current_scans" integer DEFAULT 0 NOT NULL,
	"facebook_pixel_id" text,
	"google_tag_manager_id" text,
	"design_prompt" text,
	"design_image_url" text,
	"is_artistic" boolean DEFAULT false NOT NULL,
	"logo_url" text,
	"foreground_color" text DEFAULT '#000000',
	"background_color" text DEFAULT '#FFFFFF',
	"type" text DEFAULT 'qr' NOT NULL,
	"barcode_format" text,
	CONSTRAINT "qr_codes_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE TABLE "scans" (
	"id" serial PRIMARY KEY NOT NULL,
	"qr_code_id" integer NOT NULL,
	"scanned_at" timestamp DEFAULT now() NOT NULL,
	"os" text,
	"device_type" text,
	"user_agent" text,
	"country" text,
	"city" text,
	"latitude" real,
	"longitude" real,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text
);
--> statement-breakpoint
CREATE TABLE "webhooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"url" text NOT NULL,
	"events" jsonb NOT NULL,
	"secret" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_success_at" timestamp,
	"last_failure_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_page_clicks" ADD CONSTRAINT "landing_page_clicks_landing_page_link_id_landing_page_links_id_fk" FOREIGN KEY ("landing_page_link_id") REFERENCES "public"."landing_page_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD CONSTRAINT "landing_page_links_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_code_versions" ADD CONSTRAINT "qr_code_versions_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_workspace_id_idx" ON "api_keys" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "landing_page_clicks_landing_page_link_id_idx" ON "landing_page_clicks" USING btree ("landing_page_link_id");--> statement-breakpoint
CREATE INDEX "landing_page_links_landing_page_id_idx" ON "landing_page_links" USING btree ("landing_page_id");--> statement-breakpoint
CREATE INDEX "landing_pages_workspace_id_idx" ON "landing_pages" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "qr_code_versions_qr_code_id_idx" ON "qr_code_versions" USING btree ("qr_code_id");--> statement-breakpoint
CREATE INDEX "qr_codes_workspace_id_created_at_idx" ON "qr_codes" USING btree ("workspace_id","created_at");--> statement-breakpoint
CREATE INDEX "qr_codes_short_code_idx" ON "qr_codes" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "scans_qr_code_id_scanned_at_idx" ON "scans" USING btree ("qr_code_id","scanned_at");--> statement-breakpoint
CREATE INDEX "webhooks_workspace_id_idx" ON "webhooks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_members_workspace_id_idx" ON "workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members" USING btree ("user_id");