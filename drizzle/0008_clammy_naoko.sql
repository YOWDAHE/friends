ALTER TABLE "reservation_tickets" DROP CONSTRAINT "reservation_tickets_ticket_id_tickets_id_fk";
--> statement-breakpoint
ALTER TABLE "reservation_tickets" ADD CONSTRAINT "reservation_tickets_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;