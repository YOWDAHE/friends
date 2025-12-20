"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

type PublicEvent = {
	id: number;
	title: string;
	subtitle: string | null;
	imageUrl: string | null;
	slug?: string | null;
	isPublished: boolean;
	dateTime: string;
};

function Upcoming() {
	const [events, setEvents] = useState<PublicEvent[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch("/api/admin/events");
				if (!res.ok) throw new Error("Failed to fetch events");
				const { events } = (await res.json()) as { events: PublicEvent[] };
				setEvents(events.filter((event) => event.isPublished == true));
			} catch (e) {
				console.error("Error fetching events:", e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	if (loading) {
		return (
			<div className="relative overflow-y-hidden min-h-screen md:px-8 pb-10 flex justify-center w-full">
				<div className="mt-20 flex items-center justify-center">
					<Spinner />
				</div>
			</div>
		);
	}

	if (!events.length) {
		return (
			<div className="relative overflow-y-hidden min-h-screen md:px-8 pb-10 flex justify-center w-full">
				<div className="z-20 relative mt-20 max-w-[1400px] w-full">
					<section className="relative z-10 md:py-24 py-16">
						<div className="mx-auto flex w-full flex-col gap-10 px-4 md:px-8">
							<div className="flex flex-col gap-2">
								<h2 className="font-rage text-5xl md:text-6xl leading-[40px] md:leading-[56px]">
									Upcoming
									<br />
									Events
								</h2>
							</div>
							<p className="text-gray-700">No upcoming events at the moment.</p>
						</div>
					</section>
				</div>
			</div>
		);
	}

	return (
		<div className="relative overflow-y-hidden min-h-screen md:px-8 pb-10 flex justify-center w-full">
			<div className="z-20 relative mt-20 max-w-[1400px] w-full">
				<section className="relative z-10 md:py-24 py-16">
					<div className="mx-auto flex w-full flex-col gap-10 px-4 md:px-8">
						{/* Heading */}
						<div className="flex flex-col gap-2">
							<h2 className="font-rage text-5xl md:text-6xl leading-[40px] md:leading-[56px]">
								Upcoming
								<br />
								Events
							</h2>
						</div>

						{/* Events list */}
						<div className="flex flex-wrap gap-12 md:gap-8">
							{events.map((event) => {
								const href = event.slug
									? `/reserve/${event.slug}`
									: `/reserve/${event.id}`;
								return (
									<article
										key={event.id}
										className="flex flex-col gap-4 max-w-lg min-w-sm md:min-w-lg bg-white/80 p-4 rounded-sm"
									>
										{/* Poster */}
										<div className="relative h-64 w-full overflow-hidden rounded-sm md:h-[360px]">
											<Image
												src={event.imageUrl || "/placeholder.svg"}
												alt={event.title}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, 50vw"
											/>
										</div>

										{/* Text */}
										<div className="flex flex-col gap-2">
											<h3 className="text-xl font-extrabold md:text-2xl">{event.title}</h3>
											{event.subtitle && (
												<p className="text-base text-neutral-800 md:text-lg">
													{event.subtitle}
												</p>
											)}
											<Link
												href={href}
												className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-orange-500 md:text-base"
											>
												View Detail
												<span aria-hidden>↗</span>
											</Link>
										</div>
									</article>
								);
							})}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Upcoming;
