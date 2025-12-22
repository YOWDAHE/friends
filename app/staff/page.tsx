"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type StaffEvent = {
	id: number;
	title: string;
};

type StaffReservation = {
	id: number;
	name: string;
	email: string;
	phone: string;
	partySize: number;
	status: string;
	createdAt: string;
};

export default function StaffHomePage() {
	const router = useRouter();
	const [token, setToken] = useState<string | null>(null);
	const [events, setEvents] = useState<StaffEvent[]>([]);
	const [selectedEventId, setSelectedEventId] = useState<string>("");
	const [search, setSearch] = useState("");
	const [reservations, setReservations] = useState<StaffReservation[]>([]);
	const [loadingEvents, setLoadingEvents] = useState(true);
	const [loadingGuests, setLoadingGuests] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load token from localStorage client-side
	useEffect(() => {
		const stored =
			typeof window !== "undefined" ? localStorage.getItem("staff_jwt") : null;

		if (!stored) {
			router.replace("/staff/login");
			return;
		}
		setToken(stored);
	}, [router]);

	// Load events available to staff
	useEffect(() => {
		const loadEvents = async () => {
			if (!token) return;
			setLoadingEvents(true);
			setError(null);
			try {
				const res = await fetch("/api/staff/events", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (res.status === 401) {
					router.replace("/staff/login");
					return;
				}
				if (!res.ok) throw new Error("Failed to load events");
				const data = (await res.json()) as { events: StaffEvent[] };
				setEvents(data.events);
			} catch (e) {
				console.error("Error loading staff events", e);
				setError("Failed to load events");
			} finally {
				setLoadingEvents(false);
			}
		};
		if (token) loadEvents();
	}, [token, router]);

	const loadGuests = async (eventId: string, query: string) => {
		if (!token || !eventId) return;
		setLoadingGuests(true);
		setError(null);
		try {
			const params = new URLSearchParams({ eventId });
			if (query.trim().length) params.set("q", query.trim());

			const res = await fetch(`/api/staff/event-guests?${params.toString()}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.status === 401) {
				router.replace("/staff/login");
				return;
			}
			if (!res.ok) throw new Error("Failed to load guests");
			const data = (await res.json()) as { reservations: StaffReservation[] };
			setReservations(data.reservations);
		} catch (e) {
			console.error("Error loading guests", e);
			setError("Failed to load guests");
		} finally {
			setLoadingGuests(false);
		}
	};

	const handleEventChange = (value: string) => {
		setSelectedEventId(value);
		setReservations([]);
		if (value) loadGuests(value, search);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedEventId) loadGuests(selectedEventId, search);
	};

	if (!token) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-8">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Staff guest list</h1>
					<p className="text-sm text-gray-600">
						Select an event and search for guests by name.
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						localStorage.removeItem("staff_jwt");
						router.replace("/staff/login");
					}}
				>
					Log out
				</Button>
			</header>

			<section className="space-y-4 rounded-lg border bg-white p-4">
				<div className="grid gap-4 md:grid-cols-[2fr_3fr] md:items-end">
					<div className="space-y-2">
						<Label>Event</Label>
						{loadingEvents ? (
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<Spinner className="h-4 w-4" /> Loading events…
							</div>
						) : (
							<Select value={selectedEventId} onValueChange={handleEventChange}>
								<SelectTrigger>
									<SelectValue placeholder="Choose an event" />
								</SelectTrigger>
								<SelectContent>
									{events.map((e) => (
										<SelectItem key={e.id} value={String(e.id)}>
											{e.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>

					<form onSubmit={handleSearch} className="space-y-2">
						<Label htmlFor="search">Search guest name</Label>
						<div className="flex gap-2">
							<Input
								id="search"
								placeholder="Type a name…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								disabled={!selectedEventId}
							/>
							<Button type="submit" disabled={!selectedEventId || loadingGuests}>
								Search
							</Button>
						</div>
					</form>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}
			</section>

			<section className="space-y-2 rounded-lg border bg-white p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold">Guests</h2>
					{loadingGuests && (
						<div className="flex items-center gap-2 text-xs text-gray-500">
							<Spinner className="h-3 w-3" /> Loading…
						</div>
					)}
				</div>

				{reservations.length === 0 && !loadingGuests && (
					<p className="text-sm text-gray-500">
						{selectedEventId
							? "No guests found for this event."
							: "Select an event to see the guest list."}
					</p>
				)}

				{reservations.length > 0 && (
					<div className="divide-y text-sm">
						{reservations.map((r) => (
							<div
								key={r.id}
								className="flex flex-wrap items-center justify-between gap-2 py-2"
							>
								<div>
									<p className="font-medium">{r.name}</p>
									<p className="text-xs text-gray-500">
										{r.email} · {r.phone}
									</p>
								</div>
								<div className="text-right text-xs text-gray-600">
									<p>{r.partySize} guests</p>
									<p className="capitalize">{r.status.toLowerCase()}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
