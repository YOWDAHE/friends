ALTER TABLE "contact_messages" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "archived_at" timestamp with time zone;