"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReservationDetailDialog } from "@/components/admin/reservation-detail-dialog";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type ApiReservationRow = {
	reservation: {
		id: number;
		eventId: number | null;
		name: string;
		email: string;
		phone: string;
		partySize: number;
		notes: string | null;
		status: ReservationStatus;
		createdAt: string | null;
	};
	event: {
		id: number;
		title: string;
		dateTime: string;
		location: string;
	} | null;
};

type UiReservation = {
	id: number;
	name: string;
	email: string;
	phone: string;
	partySize: number;
	eventName: string;
	status: ReservationStatus;
	createdAt: string;
	notes: string;
	date: string | null;
};

type ApiResponse = {
	reservations: ApiReservationRow[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
};

export default function ReservationsPage() {
	const [allReservations, setAllReservations] = useState<UiReservation[]>([]);
	const [loading, setLoading] = useState(true);

	const [selectedReservation, setSelectedReservation] =
		useState<UiReservation | null>(null);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

	// Filters & pagination
	const [searchQuery, setSearchQuery] = useState("");
	const [eventFilter, setEventFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("");
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 10;

	// Load all reservations once
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/admin/reservations", {
					cache: "no-store",
				});
				if (!res.ok) throw new Error("Failed to load reservations");
				const data = (await res.json()) as { reservations: ApiReservationRow[] };

				const ui: UiReservation[] = data.reservations.map((row) => {
					const r = row.reservation;
					const e = row.event;
					const created = r.createdAt ? new Date(r.createdAt) : null;
					const eventDate = e?.dateTime ? new Date(e.dateTime) : null;

					return {
						id: r.id,
						name: r.name,
						email: r.email,
						phone: r.phone,
						partySize: r.partySize,
						eventName: e?.title ?? "General Reservation",
						status: r.status,
						notes: r.notes ?? "",
						createdAt: created
							? created.toLocaleString("en-US", {
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
							  })
							: "",
						date: eventDate ? eventDate.toISOString().slice(0, 10) : null,
					};
				});

				setAllReservations(ui);
			} catch (e) {
				console.error("Error loading reservations", e);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	// Filter function
	const filteredReservations = allReservations.filter((reservation) => {
		const matchesSearch =
			!searchQuery ||
			reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			reservation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			reservation.phone.includes(searchQuery);

		const matchesEvent =
			eventFilter === "all" || reservation.eventName === eventFilter;
		const matchesDate = !dateFilter || reservation.date === dateFilter;

		return matchesSearch && matchesEvent && matchesDate;
	});

	// Pagination
	const totalPages = Math.ceil(filteredReservations.length / PAGE_SIZE);
	const paginatedReservations = filteredReservations.slice(
		(page - 1) * PAGE_SIZE,
		page * PAGE_SIZE
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPage(Math.max(1, Math.min(newPage, totalPages)));
		},
		[totalPages]
	);

	const uniqueEvents = Array.from(
		new Set(allReservations.map((r) => r.eventName))
	);

	const handleViewReservation = (reservation: UiReservation) => {
		setSelectedReservation(reservation);
		setIsDetailDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-rage text-4xl md:text-5xl">Reservations</h1>
				<p className="mt-2 text-gray-600">
					View completed reservations and bookings
				</p>
			</div>

			{/* Filters & Search */}
			<div className="grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">
				<Input
					placeholder="Search by name, email or phone..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="bg-white"
				/>

				<Select value={eventFilter} onValueChange={setEventFilter}>
					<SelectTrigger className="bg-white">
						<SelectValue placeholder="Filter by event" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Events</SelectItem>
						{uniqueEvents.map((event) => (
							<SelectItem key={event} value={event}>
								{event}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Input
					type="date"
					value={dateFilter}
					onChange={(e) => setDateFilter(e.target.value)}
					className="w-full bg-white"
				/>

				{(searchQuery || eventFilter !== "all" || dateFilter) && (
					<Button
						variant="ghost"
						onClick={() => {
							setSearchQuery("");
							setEventFilter("all");
							setDateFilter("");
							setPage(1);
						}}
					>
						Clear Filters
					</Button>
				)}
			</div>

			{/* Results info */}
			<div className="text-sm text-gray-500">
				Showing {paginatedReservations.length} of {filteredReservations.length}{" "}
				reservations
				{filteredReservations.length !== allReservations.length &&
					` (filtered from ${allReservations.length})`}
			</div>

			{/* Table */}
			<div className="rounded-lg border bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Guest</TableHead>
							<TableHead>Contact</TableHead>
							<TableHead>Party Size</TableHead>
							<TableHead>Event</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : paginatedReservations.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center text-gray-500">
									{loading ? "Loading..." : "No reservations found"}
								</TableCell>
							</TableRow>
						) : (
							paginatedReservations.map((reservation) => (
								<TableRow key={reservation.id}>
									<TableCell>
										<div className="font-semibold">{reservation.name}</div>
									</TableCell>
									<TableCell>
										<div className="text-sm">
											<div>{reservation.email}</div>
											<div className="text-gray-500">{reservation.phone}</div>
										</div>
									</TableCell>
									<TableCell>
										<span className="font-medium">{reservation.partySize}</span>
									</TableCell>
									<TableCell>
										<div className="max-w-[180px] truncate text-sm">
											{reservation.eventName}
										</div>
									</TableCell>
									<TableCell>
										<div className="text-sm text-gray-500">{reservation.createdAt}</div>
									</TableCell>
									<TableCell>
										<div className="flex justify-end">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleViewReservation(reservation)}
												title="View details"
											>
												<Eye className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-500">
						Page {page} of {totalPages}
					</div>

					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(page - 1)}
							disabled={page === 1}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(page + 1)}
							disabled={page === totalPages}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Reservation Detail Dialog */}
			{selectedReservation && (
				<ReservationDetailDialog
					open={isDetailDialogOpen}
					onOpenChange={setIsDetailDialogOpen}
					reservation={selectedReservation}
					onStatusChange={() => {}}
				/>
			)}
		</div>
	);
}
