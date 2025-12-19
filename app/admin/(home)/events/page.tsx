"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function EventsPage() {
	const [events, setEvents] = useState<EventRecord[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
	const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<EventRecord | null>(null);

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

	const handleSaveEvent = async (data: {
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
			if (editingEvent) {
				const res = await fetch(`/api/admin/events/${editingEvent.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error("Failed to update event");
				const { event } = (await res.json()) as { event: EventRecord };

				setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
				setEditingEvent(null);
			} else {
				const res = await fetch("/api/admin/events", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error("Failed to create event");
				const { event } = (await res.json()) as { event: EventRecord };

				setEvents((prev) => [event, ...prev]);
			}
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

	const handleViewEvent = (event: EventRecord) => {
		setSelectedEvent(event);
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
				<EventFormDialog event={null} onSave={handleSaveEvent}>
					<Button
						className="gap-2"
						type="button"
						onClick={() => setEditingEvent(null)}
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
												<Eye className="h-4 w-4" />
											</Button>

											<EventFormDialog event={event} onSave={handleSaveEvent}>
												<Button
													variant="ghost"
													size="icon"
													type="button"
													onClick={() => setEditingEvent(event)}
												>
													<Pencil className="h-4 w-4" />
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
