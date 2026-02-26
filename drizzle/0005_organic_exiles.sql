CREATE TABLE "media_library" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"width" integer,
	"height" integer,
	"alt_text" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"folder" text,
	"uploaded_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"landing_page_id" integer NOT NULL,
	"version_number" integer NOT NULL,
	"page_structure" jsonb NOT NULL,
	"settings" jsonb,
	"changed_by" text NOT NULL,
	"change_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_components" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"thumbnail" text,
	"component_data" jsonb NOT NULL,
	"category" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_by" text NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "page_structure" jsonb;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "design_tokens" jsonb;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD COLUMN "builder_version" text DEFAULT 'v1';--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_versions" ADD CONSTRAINT "page_versions_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_components" ADD CONSTRAINT "saved_components_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_library_workspace_id_idx" ON "media_library" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "media_library_mime_type_idx" ON "media_library" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "media_library_folder_idx" ON "media_library" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "page_versions_landing_page_id_idx" ON "page_versions" USING btree ("landing_page_id");--> statement-breakpoint
CREATE INDEX "page_versions_landing_page_id_version_idx" ON "page_versions" USING btree ("landing_page_id","version_number");--> statement-breakpoint
CREATE INDEX "saved_components_workspace_id_idx" ON "saved_components" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "saved_components_category_idx" ON "saved_components" USING btree ("category");