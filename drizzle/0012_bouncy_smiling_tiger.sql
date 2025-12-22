CREATE TABLE "staff_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"password_hash" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
