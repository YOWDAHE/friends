import {
	pgTable,
	serial,
	text,
	timestamp,
	boolean,
	integer,
	numeric,
	uniqueIndex,
} from "drizzle-orm/pg-core";

// ======
// Auth / Admin Users
// ======
//
// Used by NextAuth in `app/api/auth/[...nextauth]/route.ts`:
//   import { users } from "@/db/schema"
//
// Admins are represented by users with role = "ADMIN". You can add more roles
// later if needed (e.g. "STAFF", "MANAGER").

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name"),
	email: text("email").notNull().unique(),
	emailVerified: timestamp("email_verified", { withTimezone: true }),
	// Optional for OAuth-only accounts; required for credentials logins
	passwordHash: text("password_hash"),
	role: text("role").notNull().default("USER"), // USER | ADMIN
	isActive: boolean("is_active").notNull().default(true),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// =====================
// Events & Reservations
// =====================

export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	subtitle: text("subtitle"),
	description: text("description"),
	startDate: timestamp("start_date", { withTimezone: true }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true }).notNull(),
	startTime: timestamp("start_time", { withTimezone: true }).notNull(),
	endTime: timestamp("end_time", { withTimezone: true }).notNull(),
	location: text("location").notNull(),
	imageUrl: text("image_url"),
	imagePublicId: text("image_public_id"),
	isArchived: boolean("is_archived").notNull().default(false),
	isPaidEvent: boolean("is_paid_event").notNull().default(false),
	isPublished: boolean("is_published").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const reservations = pgTable("reservations", {
	id: serial("id").primaryKey(),
	eventId: integer("event_id").references(() => events.id, {onDelete: "cascade"}),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull(),
	partySize: integer("party_size").notNull(),
	notes: text("notes"),
	status: text("status").notNull().default("PENDING"), // PENDING | CONFIRMED | CANCELLED
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ===========
// Ticketing
// ===========
//
// A paid event can define one or more ticket types (e.g. "General Admission",
// "VIP", "Early Bird"). Reservations and online orders can then select one or
// more ticket types.

export const tickets = pgTable("tickets", {
	id: serial("id").primaryKey(),
	eventId: integer("event_id")
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	name: text("name").notNull(),             // e.g. "General Admission"
	description: text("description"),         // public description (already present)
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	capacity: integer("capacity"),            // optional max quantity available
	sold: integer("sold").notNull().default(0),
	isActive: boolean("is_active").notNull().default(true),
	sortOrder: integer("sort_order").notNull().default(0),
	category: text("category"),               // e.g. "Early Bird", "VIP"
	salesStart: timestamp("sales_start", { withTimezone: true }),
	salesEnd: timestamp("sales_end", { withTimezone: true }),
	minPerOrder: integer("min_per_order"),    // per-reservation constraints
	maxPerOrder: integer("max_per_order"),
	internalNotes: text("internal_notes"),    // admin-only
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// A reservation can optionally lock in a specific ticket type and quantity.
// This keeps the reservation entity simple while enabling per-ticket reporting.
export const reservationTickets = pgTable("reservation_tickets", {
	id: serial("id").primaryKey(),
	reservationId: integer("reservation_id")
		.notNull()
		.references(() => reservations.id, { onDelete: "cascade" }),
	ticketId: integer("ticket_id")
		.notNull()
		.references(() => tickets.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull().default(1),
	unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==============
// Payments
// ==============
//
// This models online payments for tickets / reservations. A payment can be
// linked to a reservation (for in-house bookings) and/or an event (for
// reporting). Multiple payments per reservation are supported (e.g. partial
// payments or retries).

export const payments = pgTable("payments", {
	id: serial("id").primaryKey(),
	// Optional link to reservation and event for reporting / lookups
	reservationId: integer("reservation_id").references(() => reservations.id, {
		onDelete: "set null",
	}),
	eventId: integer("event_id").references(() => events.id, {
		onDelete: "cascade",
	}),
	// Monetary details
	amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
	currency: text("currency").notNull().default("USD"),
	// Status: PENDING | REQUIRES_ACTION | SUCCEEDED | FAILED | REFUNDED
	status: text("status").notNull().default("PENDING"),
	// Basic provider metadata (Stripe, PayPal, etc.)
	provider: text("provider").notNull().default("stripe"),
	providerPaymentId: text("provider_payment_id"),
	providerClientSecret: text("provider_client_secret"),
	// How the payment was initiated (online checkout, admin, POS, etc.)
	source: text("source").notNull().default("online"),
	// For simple reconciliation / notes
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
	// 🔐 unique constraint for idempotency
	providerPaymentIdUnique: uniqueIndex("payments_providerPaymentId_unique").on(
		table.providerPaymentId,
	),
}),);

// Optional table for storing individual charge / refund events, webhook logs,
// or provider responses for debugging and audits.
export const paymentEvents = pgTable("payment_events", {
	id: serial("id").primaryKey(),
	paymentId: integer("payment_id")
		.notNull()
		.references(() => payments.id, { onDelete: "cascade" }),
	type: text("type").notNull(), // e.g. "payment_created", "webhook", "refund"
	rawPayload: text("raw_payload"), // JSON string from provider
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============
// Menu Schema
// ============
//
// This mirrors the structure used by:
// - Public menu JSON (`data/menu.json`)
// - Admin UI in `app/admin/menu/page.tsx`
//
// Hierarchy:
//   menu_categories -> menu_sections -> menu_items
//
// - Categories: "Happy Hour", "Appetizers", "Entrees", "Cocktails", "Cafe", etc.
//   - Have a slug (for URLs / JSON ids like "happy-hour") and optional tagline.
// - Sections: "Happy Hour Bites", "Happy Hour Drinks", "Starters", etc.
//   - Belong to a category, have an image and imagePosition (left/right) to match the public UI.
// - Items: individual dishes/drinks with price, description, and visibility flag used by the admin UI.

export const menuCategories = pgTable("menu_categories", {
	id: serial("id").primaryKey(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	tagline: text("tagline"),
	// For controlling display order in both public and admin UIs
	sortOrder: integer("sort_order").notNull().default(0),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const menuSections = pgTable("menu_sections", {
	id: serial("id").primaryKey(),
	categoryId: integer("category_id")
		.notNull()
		.references(() => menuCategories.id, { onDelete: "cascade" }),
	// Stable id to match JSON / scroll targets if needed
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	imageUrl: text("image_url"),
	imagePublicId: text("image_public_id"),
	// "left" | "right" – matches the public menu layout imagePosition
	imagePosition: text("image_position").default("left"),
	sortOrder: integer("sort_order").notNull().default(0),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const menuItems = pgTable("menu_items", {
	id: serial("id").primaryKey(),
	sectionId: integer("section_id")
		.notNull()
		.references(() => menuSections.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	// Raw numeric price; formatting with $ happens in the UI
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	description: text("description"),
	// When false, item is hidden in public menu but still editable in admin (Switch in admin UI)
	isVisible: boolean("is_visible").notNull().default(true),
	sortOrder: integer("sort_order").notNull().default(0),
	isFeatured: boolean("is_featured").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const eventAnalytics = pgTable("event_analytics", {
	id: serial("id").primaryKey(),
	eventId: integer("event_id").notNull(), // no FK on purpose, event may be deleted
	title: text("title").notNull(),
	startDate: timestamp("start_date", { withTimezone: true }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true }).notNull(),
	totalGuests: integer("total_guests").notNull(),
	totalReservations: integer("total_reservations").notNull(),
	totalRevenue: numeric("total_revenue", { precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const revenueByMonth = pgTable("revenue_by_month", {
	id: serial("id").primaryKey(),
	year: integer("year").notNull(),
	month: integer("month").notNull(), // 1-12
	totalRevenue: numeric("total_revenue", { precision: 10, scale: 2 }).notNull(),
	totalReservations: integer("total_reservations").notNull(),
	totalGuests: integer("total_guests").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone"),
	subject: text("subject"),
	message: text("message").notNull(),
	// simple status for admin
	isRead: boolean("is_read").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});