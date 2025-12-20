"use client";

import { useEffect, useState, useCallback, useRef, useTransition } from "react";
import { Calendar, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { EventDetailSheet } from "@/components/admin/event-detail-sheet";
import { Spinner } from "@/components/ui/spinner";
import type { EventRecord } from "@/types/events";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TicketForm = {
	id?: number;
	name: string;
	price: string;
	description?: string;
	capacity?: number;
	sortOrder?: number;
	isActive?: boolean;
};

type EventWithTickets = EventRecord & { tickets?: TicketForm[] };

export default function EventsPage() {
	const [events, setEvents] = useState<EventRecord[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<EventWithTickets | null>(
		null
	);
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<EventRecord | null>(null);

	// use EventWithTickets here so tickets are allowed
	const [editingEvent, setEditingEvent] = useState<EventWithTickets | null>(
		null
	);
	const [eventTickets, setEventTickets] = useState<Record<number, TicketForm[]>>(
		{}
	);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [editButtonLoading, startEditButton] = useTransition();
	const [detailButtonLoading, loadDetailPage] = useTransition();

	const fetchEvents = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/admin/events");
			if (!res.ok) throw new Error("Failed to fetch events");
			const { events } = (await res.json()) as { events: EventRecord[] };
			setEvents(events);
		} catch (err) {
			console.error("Error fetching events:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEvents();
	}, [fetchEvents]);

	const loadTicketsForEvent = async (eventId: number): Promise<TicketForm[]> => {
		try {
			const res = await fetch(`/api/admin/events/${eventId}/tickets`);
			if (!res.ok) return [];
			const data = await res.json();
			const tickets = (data.tickets ?? []) as any[];

			const normalized = tickets.map((t, index) => ({
				id: t.id,
				name: t.name,
				price: t.price,
				description: t.description ?? "",
				capacity: t.capacity ?? undefined,
				sortOrder: t.sortOrder ?? index,
				isActive: t.isActive ?? true,
			}));

			setEventTickets((prev) => ({ ...prev, [eventId]: normalized }));
			return normalized;
		} catch (e) {
			console.error("Error loading tickets:", e);
			return [];
		}
	};

	const handleSaveEvent = async (data: {
		id?: number;
		title: string;
		subtitle?: string;
		description?: string;
		date: string;
		time: string;
		location: string;
		imageUrl?: string;
		isPublished?: boolean;
		isPaidEvent?: boolean;
		imagePublicId?: string;
		tickets?: TicketForm[];
	}) => {
		const dateTimeIso = new Date(`${data.date}T${data.time}:00`).toISOString();

		const payload = {
			title: data.title,
			subtitle: data.subtitle ?? null,
			description: data.description ?? null,
			dateTime: dateTimeIso,
			location: data.location,
			imageUrl: data.imageUrl ?? null,
			imagePublicId: data.imagePublicId ?? null,
			isPublished: data.isPublished ?? false,
			isPaidEvent: data.isPaidEvent ?? false,
		};

		try {
			let eventId: number;

			if (data.id) {
				// EDIT
				const res = await fetch(`/api/admin/events/${data.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error("Failed to update event");
				const { event } = (await res.json()) as { event: EventRecord };
				eventId = event.id;
				setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
			} else {
				// CREATE
				const res = await fetch("/api/admin/events", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error("Failed to create event");
				const { event } = (await res.json()) as { event: EventRecord };
				eventId = event.id;
				setEvents((prev) => [event, ...prev]);
			}

			const ticketsPayload =
				data.isPaidEvent && data.tickets && data.tickets.length
					? data.tickets.map((t, index) => ({
							name: t.name,
							price: t.price,
							description: t.description ?? null,
							capacity: t.capacity ?? null,
							sortOrder: t.sortOrder ?? index,
							isActive: t.isActive ?? true,
					  }))
					: [];

			await fetch(`/api/admin/events/${eventId}/tickets`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(ticketsPayload),
			});
		} catch (err) {
			console.error("Error saving event:", err);
		}
	};

	const openDeleteDialog = (event: EventRecord) => {
		setEventToDelete(event);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!eventToDelete) return;
		try {
			const res = await fetch(`/api/admin/events/${eventToDelete.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete event");
			setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
		} catch (err) {
			console.error("Error deleting event:", err);
		} finally {
			setDeleteDialogOpen(false);
			setEventToDelete(null);
		}
	};

	const handleViewEvent = async (event: EventRecord) => {
		loadDetailPage(async () => {
			const tickets = await loadTicketsForEvent(event.id);
			setSelectedEvent({
				...event,
				tickets,
			});
		});
		setDetailSheetOpen(true);
	};

	if (loading) {
		return (
			<div className="p-8 flex items-center justify-center h-full w-full">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-end justify-between">
				<div>
					<h1 className="font-rage text-4xl md:text-5xl">Upcoming Events</h1>
					<p className="mt-2 text-gray-600">Manage upcoming and past events</p>
				</div>

				{/* Create dialog */}
				<EventFormDialog event={null} onSave={handleSaveEvent}>
					<Button
						className="gap-2"
						type="button"
						onClick={() => {
							setEditingEvent(null);
						}}
					>
						<Plus className="h-4 w-4" />
						Create Event
					</Button>
				</EventFormDialog>
			</div>

			{/* Events Table */}
			<div className="rounded-lg border bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Event</TableHead>
							<TableHead>Date & Time</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{events.map((event) => {
							const dt = new Date(event.dateTime);
							const isEditingThis = editingEvent?.id === event.id;
							const eventForDialog: EventWithTickets =
								isEditingThis && editingEvent ? editingEvent : { ...event }; // plain event when not editing

							return (
								<TableRow key={event.id}>
									<TableCell>
										<div>
											<div className="font-semibold">{event.title}</div>
											<div className="text-sm text-gray-500">{event.subtitle}</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-gray-400" />
											<div>
												<div className="text-sm">
													{dt.toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</div>
												<div className="text-xs text-gray-500">
													{dt.toLocaleTimeString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={event.isPublished ? "default" : "secondary"}>
											{event.isPublished ? "Live" : "Draft"}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleViewEvent(event)}
											>
												{detailButtonLoading ? <Spinner /> : <Eye className="h-4 w-4" />}
											</Button>

											<EventFormDialog
												event={{
													...event,
													tickets: eventTickets[event.id] ?? [],
												}}
												onSave={handleSaveEvent}
											>
												<Button
													ref={buttonRef}
													variant="ghost"
													size="icon"
													type="button"
													onClick={async (e) => {
														if (eventTickets[event.id]) return; // tickets already loaded

														e.preventDefault();
														startEditButton(async () => {
															await loadTicketsForEvent(event.id);
															buttonRef.current?.click();
														});
														// tickets now in state; trigger the click again to open dialog
													}}
												>
													{editButtonLoading ? <Spinner /> : <Pencil className="h-4 w-4" />}
												</Button>
											</EventFormDialog>

											<Button
												variant="ghost"
												size="icon"
												onClick={() => openDeleteDialog(event)}
												className="text-red-600 hover:bg-red-50 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Detail Sheet */}
			{selectedEvent && (
				<EventDetailSheet
					open={detailSheetOpen}
					onOpenChange={setDetailSheetOpen}
					event={selectedEvent}
				/>
			)}

			{/* Delete confirmation */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete event?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the event
							{eventToDelete ? ` “${eventToDelete.title}”` : ""}. This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={confirmDelete}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
