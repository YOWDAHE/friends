"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, UtensilsCrossed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type DashboardStats = {
	nextEvent: {
		title: string;
		dateLabel: string;
	} | null;
	today: {
		reservationsCount: number;
		totalGuests: number;
	};
	thisWeek: {
		reservationsCount: number;
		totalGuests: number;
	};
	menu: {
		itemsCount: number;
		categoriesCount: number;
	};
};

export default function AdminDashboard() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadStats = async () => {
			try {
				const res = await fetch("/api/admin/dashboard", {
					cache: "no-store",
				});
				if (!res.ok) throw new Error("Failed to load dashboard stats");
				const data = (await res.json()) as DashboardStats;
				setStats(data);
			} catch (e) {
				console.error("Error loading dashboard stats", e);
			} finally {
				setLoading(false);
			}
		};
		loadStats();
	}, []);

	const nextEventTitle = stats?.nextEvent?.title ?? "No upcoming events";
	const nextEventDate =
		stats?.nextEvent?.dateLabel ?? "Schedule your next event";

	const todayReservations = stats?.today.reservationsCount ?? 0;
	const todayGuests = stats?.today.totalGuests ?? 0;

	const weekReservations = stats?.thisWeek.reservationsCount ?? 0;
	const weekGuests = stats?.thisWeek.totalGuests ?? 0;

	const menuItems = stats?.menu.itemsCount ?? 0;
	const menuCategories = stats?.menu.categoriesCount ?? 0;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="font-rage text-4xl md:text-5xl">Welcome back</h1>
				<p className="mt-2 text-lg text-gray-600">
					Here&apos;s what&apos;s happening with your restaurant today.
				</p>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{/* Next Event Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Next Upcoming Event
						</CardTitle>
						<Calendar className="h-5 w-5 text-gray-400" />
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="text-sm text-gray-400">Loading…</div>
						) : (
							<>
								<div className="text-lg font-semibold line-clamp-2">
									{nextEventTitle}
								</div>
								<p className="mt-1 text-sm text-gray-500">{nextEventDate}</p>
								<Link
									href="/admin/events"
									className="mt-3 inline-flex text-xs text-orange-500 hover:underline"
								>
									Manage events
								</Link>
							</>
						)}
					</CardContent>
				</Card>

				{/* Reservations Today Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Reservations Today
						</CardTitle>
						<Users className="h-5 w-5 text-gray-400" />
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="text-sm text-gray-400">Loading…</div>
						) : (
							<>
								<div className="text-2xl font-bold">{todayReservations}</div>
								<p className="mt-1 text-sm text-gray-500">
									{todayGuests} guests booked
								</p>
								<Link
									href="/admin/reservations"
									className="mt-3 inline-flex text-xs text-orange-500 hover:underline"
								>
									View today&apos;s reservations
								</Link>
							</>
						)}
					</CardContent>
				</Card>

				{/* This Week Reservations */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							This Week&apos;s Bookings
						</CardTitle>
						<Users className="h-5 w-5 text-gray-400" />
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="text-sm text-gray-400">Loading…</div>
						) : (
							<>
								<div className="text-2xl font-bold">{weekReservations}</div>
								<p className="mt-1 text-sm text-gray-500">
									{weekGuests} guests expected
								</p>
							</>
						)}
					</CardContent>
				</Card>

				{/* Menu Items Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-gray-600">
							Menu Items Live
						</CardTitle>
						<UtensilsCrossed className="h-5 w-5 text-gray-400" />
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="text-sm text-gray-400">Loading…</div>
						) : (
							<>
								<div className="text-2xl font-bold">{menuItems}</div>
								<p className="mt-1 text-sm text-gray-500">
									Across {menuCategories} categories
								</p>
								<Link
									href="/admin/menu"
									className="mt-3 inline-flex text-xs text-orange-500 hover:underline"
								>
									Edit menu
								</Link>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-3">
					<Link href="/admin/events">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Create Event
						</Button>
					</Link>
					<Link href="/admin/menu">
						<Button variant="outline" className="gap-2 bg-transparent">
							<UtensilsCrossed className="h-4 w-4" />
							Manage Menu
						</Button>
					</Link>
					<Link href="/admin/reservations">
						<Button variant="outline" className="gap-2 bg-transparent">
							<Users className="h-4 w-4" />
							View Reservations
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
