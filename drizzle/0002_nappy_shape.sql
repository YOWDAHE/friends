ALTER TABLE "tickets" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "sales_start" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "sales_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "min_per_order" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "max_per_order" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "internal_notes" text;