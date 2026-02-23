ALTER TABLE "qr_codes" ALTER COLUMN "destination_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD COLUMN "content_type" text DEFAULT 'url' NOT NULL;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD COLUMN "content_data" jsonb;