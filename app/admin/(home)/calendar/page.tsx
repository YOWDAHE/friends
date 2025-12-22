"use client";

import { useEffect, useState, useCallback } from "react";
import {
	Calendar as BigCalendar,
	dateFnsLocalizer,
	View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

const locales = {
	"en-US": enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
	getDay,
	locales,
});

type CalendarEvent = {
	id: number;
	title: string;
	start: string; // ISO
	end: string; // ISO
	isPublished: boolean;
	isPaidEvent: boolean;
};

export default function AdminCalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchMonth = useCallback(async (date: Date) => {
		try {
			setLoading(true);
			const year = date.getFullYear();
			const month = date.getMonth() + 1; // 1-based

			const res = await fetch(
				`/api/admin/bookings-calendar?year=${year}&month=${month}`
			);
			if (!res.ok) throw new Error("Failed to load bookings calendar");
			const data = (await res.json()) as { events: CalendarEvent[] };
			setEvents(data.events);
		} catch (e) {
			console.error("Error loading bookings calendar", e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMonth(currentDate);
	}, [currentDate, fetchMonth]);

	const handleNavigate = (newDate: Date) => {
		setCurrentDate(newDate);
	};

	const handleView = (view: View) => {
		// If you ever support week/day, you can react to view changes here
	};

	const calendarEvents = events.map((ev) => ({
		...ev,
		start: new Date(ev.start),
		end: new Date(ev.end),
	}));

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-rage text-4xl md:text-5xl">Bookings calendar</h1>
				<p className="mt-2 text-gray-600">
					See reservations across the month at a glance.
				</p>
			</div>

			<div className="bg-transparent border-0 p-0 shadow-none outline-0 ">
				<div>
					{loading ? (
						<div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
							<Spinner className="h-4 w-4" />
							Loading reservations…
						</div>
					) : (
						<div className="h-[700px]">
							<BigCalendar
								localizer={localizer}
								events={calendarEvents}
								onSelectEvent={(e) => {
									redirect("/admin/events");
								}}
								startAccessor="start"
								endAccessor="end"
								views={["month"]}
								view="month"
								date={currentDate}
								onNavigate={handleNavigate}
								onView={handleView}
								popup
								style={{ height: "100%", border: "none" }}
								className="border-0 shadow-none outline-0"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
