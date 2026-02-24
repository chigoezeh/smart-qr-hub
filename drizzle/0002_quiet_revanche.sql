ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "landing_page_clicks" DROP CONSTRAINT "landing_page_clicks_landing_page_link_id_landing_page_links_id_fk";
--> statement-breakpoint
ALTER TABLE "landing_page_links" DROP CONSTRAINT "landing_page_links_landing_page_id_landing_pages_id_fk";
--> statement-breakpoint
ALTER TABLE "landing_pages" DROP CONSTRAINT "landing_pages_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "qr_code_versions" DROP CONSTRAINT "qr_code_versions_qr_code_id_qr_codes_id_fk";
--> statement-breakpoint
ALTER TABLE "qr_codes" DROP CONSTRAINT "qr_codes_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "scans" DROP CONSTRAINT "scans_qr_code_id_qr_codes_id_fk";
--> statement-breakpoint
ALTER TABLE "webhooks" DROP CONSTRAINT "webhooks_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_page_clicks" ADD CONSTRAINT "landing_page_clicks_landing_page_link_id_landing_page_links_id_fk" FOREIGN KEY ("landing_page_link_id") REFERENCES "public"."landing_page_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_page_links" ADD CONSTRAINT "landing_page_links_landing_page_id_landing_pages_id_fk" FOREIGN KEY ("landing_page_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_code_versions" ADD CONSTRAINT "qr_code_versions_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;