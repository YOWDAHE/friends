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

interface EventDetailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: EventRecord;
}

const mockReservations = [
	{ id: "1", name: "John Smith", partySize: 2, status: "confirmed" },
	// ...
];

export function EventDetailSheet({
	open,
	onOpenChange,
	event,
}: EventDetailSheetProps) {
	const dt = new Date(event.dateTime);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full overflow-y-auto sm:max-w-lg p-8">
				<SheetHeader>
					<SheetTitle>Event Details</SheetTitle>
				</SheetHeader>

				<div className="mt-6 space-y-6">
					<div className="overflow-hidden rounded-lg">
						<img
							src={event.imageUrl || "/placeholder.svg"}
							alt={event.title}
							className="h-48 w-full object-cover"
						/>
					</div>

					<div>
						<div className="mb-2 flex items-center gap-2">
							<h2 className="text-2xl font-bold">{event.title}</h2>
							<Badge variant={event.isPublished ? "default" : "secondary"}>
								{event.isPublished ? "Live" : "Draft"}
							</Badge>
						</div>
						<p className="text-gray-600">{event.subtitle}</p>
					</div>

					<div className="space-y-3 rounded-lg border bg-gray-50 p-4">
						<div className="flex items-center gap-3">
							<Calendar className="h-5 w-5 text-gray-400" />
							<div>
								<div className="font-medium">
									{dt.toLocaleDateString("en-US", {
										weekday: "long",
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</div>
								<div className="text-sm text-gray-600">
									{dt.toLocaleTimeString("en-US", {
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
							<div className="font-medium">
								{/* You can replace with real count later */}
								{mockReservations.length} Reservations
							</div>
						</div>
					</div>

					<div>
						<h3 className="mb-2 font-semibold">Description</h3>
						<p className="text-gray-600 whitespace-pre-line">{event.description}</p>
					</div>

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
