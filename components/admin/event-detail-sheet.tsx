"use client";

import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Calendar, MapPin, Users } from "lucide-react";
import type { EventRecord } from "@/types/events";

type TicketDetail = {
	id?: number;
	name: string;
	price: string;
	description?: string | null;
	capacity?: number | null;
	isActive?: boolean;
};

interface EventWithTickets extends EventRecord {
	tickets?: TicketDetail[];
}

interface EventDetailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: EventWithTickets;
}

// Mock reservations for now
const mockReservations = [
	{ id: "1", name: "John Smith", partySize: 2, status: "confirmed" },
	// ...
];

export function EventDetailSheet({
	open,
	onOpenChange,
	event,
}: EventDetailSheetProps) {
	const sd = new Date(event.startDate);
	const ed = new Date(event.endDate);
	const st = new Date(event.startTime);
	const et = new Date(event.endTime);

	const activeTickets = (event.tickets ?? []).filter((t) => t.isActive ?? true);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full overflow-y-auto p-8 sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>Event Details</SheetTitle>
				</SheetHeader>

				<div className="mt-6 space-y-6">
					{/* Image */}
					<div className="overflow-hidden rounded-lg">
						<img
							src={event.imageUrl || "/placeholder.svg"}
							alt={event.title}
							className="h-48 w-full object-cover"
						/>
					</div>

					{/* Title / status */}
					<div>
						<div className="mb-2 flex items-center gap-2">
							<h2 className="text-2xl font-bold">{event.title}</h2>
							<Badge variant={event.isPublished ? "default" : "secondary"}>
								{event.isPublished ? "Live" : "Draft"}
							</Badge>
						</div>
						<p className="text-gray-600">{event.subtitle}</p>
					</div>

					{/* Info */}
					<div className="space-y-3 rounded-lg border bg-gray-50 p-4">
						<div className="flex items-center gap-3">
							<Calendar className="h-5 w-5 text-gray-400" />
							<div>
								<div className="font-medium">
									{sd.toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										// year: "numeric",
									})} -
									{ed.toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</div>
								<div className="text-sm text-gray-600">
									{st.toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})} -
									{et.toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<MapPin className="h-5 w-5 text-gray-400" />
							<div className="font-medium">{event.location}</div>
						</div>

						<div className="flex items-center gap-3">
							<Users className="h-5 w-5 text-gray-400" />
							<div className="font-medium">{mockReservations.length} Reservations</div>
						</div>
					</div>

					{/* Description */}
					<div>
						<h3 className="mb-2 font-semibold">Description</h3>
						<p className="text-gray-600 whitespace-pre-line">{event.description}</p>
					</div>

					{/* Tickets */}
					{event.isPaidEvent && activeTickets.length > 0 && (
						<div>
							<h3 className="mb-2 font-semibold">Tickets</h3>
							<div className="space-y-2">
								{activeTickets.map((ticket) => (
									<div
										key={ticket.id ?? ticket.name}
										className="flex items-start justify-between rounded-lg border bg-white p-3"
									>
										<div>
											<div className="font-medium">{ticket.name}</div>
											{ticket.description && (
												<div className="text-sm text-gray-600">{ticket.description}</div>
											)}
											{ticket.capacity != null && (
												<div className="text-xs text-gray-500">
													Capacity: {ticket.capacity}
												</div>
											)}
										</div>
										<div className="ml-4 text-sm font-semibold">${ticket.price}</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Reservations */}
					<div>
						<h3 className="mb-3 font-semibold">Event Reservations</h3>
						<div className="space-y-2">
							{mockReservations.map((reservation) => (
								<div
									key={reservation.id}
									className="flex items-center justify-between rounded-lg border bg-white p-3"
								>
									<div>
										<div className="font-medium">{reservation.name}</div>
										<div className="text-sm text-gray-500">
											Party of {reservation.partySize}
										</div>
									</div>
									<Badge
										variant={reservation.status === "confirmed" ? "default" : "secondary"}
									>
										{reservation.status}
									</Badge>
								</div>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
