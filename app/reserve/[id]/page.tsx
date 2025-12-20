"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Footer from "@/app/components/Footer";

type PublicTicket = {
	id: number;
	name: string;
	price: string;
	description: string | null;
	capacity: number | null;
	sold: number;
	isActive: boolean;
};

type PublicEvent = {
	id: number;
	title: string;
	subtitle: string | null;
	description: string | null;
	dateTime: string;
	location: string;
	imageUrl: string | null;
	isPaidEvent: boolean;
	isPublished: boolean;
};

export default function EventDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const [event, setEvent] = useState<PublicEvent | null>(null);
	const [tickets, setTickets] = useState<PublicTicket[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [agreed, setAgreed] = useState(false);

	const availableTickets = tickets.filter((t) => t.isActive);
	const selectedTicket =
		availableTickets.find((t) => t.id === selectedTicketId) ??
		availableTickets[0];

	useEffect(() => {
		if (availableTickets.length && !selectedTicketId) {
			setSelectedTicketId(availableTickets[0].id);
		}
	}, [availableTickets, selectedTicketId]);

	const ticketsLeft =
		selectedTicket && selectedTicket.capacity != null
			? Math.max(selectedTicket.capacity - selectedTicket.sold, 0)
			: null;

	const canPurchase =
		!!selectedTicket &&
		(ticketsLeft == null ? true : ticketsLeft > 0) &&
		quantity > 0;

	useEffect(() => {
		const id = params.id;
		if (!id) return;

		const load = async () => {
			try {
				const res = await fetch(`/api/admin/events/${id}`);
				if (!res.ok) {
					if (res.status === 404) {
						router.replace("/reserve");
						return;
					}
					throw new Error("Failed to load event");
				}
				const data = (await res.json()) as {
					event: PublicEvent;
					tickets: PublicTicket[];
				};
				setEvent(data.event);
				setTickets(data.tickets ?? []);
			} catch (e) {
				console.error("Error loading event", e);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [params.id, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!event) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-4">
				<p>Event not found.</p>
				<Link href="/reserve" className="text-orange-500 underline">
					Back to events
				</Link>
			</div>
		);
	}

	const dt = new Date(event.dateTime);

	return (
		<div className="relative min-h-screen flex flex-col justify-center w-full">
			{/* <Header /> */}
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-full z-10"></div>
			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#B700FF] size-100 rounded-full top-40 right-10"></div>
				<div className="absolute bg-[#FF0000] size-80 rounded-full top-[50%] left-10"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#FF6200]/70 size-100 rounded-full bottom-120 left-0"></div>
				<div className="absolute bg-[#B700FF]/70 size-70 rounded-full top-40 right-0"></div>
			</div>
			<div className="z-20 relative mt-4 md:mt-10 max-w-[1400px] w-full md:px-8">
				<div className="min-h-screen">
					<div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
						{/* Back */}
						<div className="mb-4">
							<Link
								href="/reserve"
								className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center justify-start gap-2"
							>
								<ArrowLeft /> Back to events
							</Link>
						</div>

						{/* Hero */}
						<div className="overflow-hidden rounded-lg">
							{event.imageUrl && (
								<div className="relative h-60 w-full md:h-96 rounded-sm bg-white/50">
									<Image
										src={event.imageUrl}
										alt={event.title}
										fill
										className="object-contain rounded-sm"
										sizes="100vw"
									/>
								</div>
							)}

							<div className="space-y-6 p-6 md:p-8 md:mt-10 mt-5 bg-white/50 rounded-sm">
								<div>
									<h1 className="text-3xl font-bold md:text-4xl">{event.title}</h1>
									{event.subtitle && (
										<p className="mt-2 text-neutral-700">{event.subtitle}</p>
									)}
								</div>

								{/* Meta */}
								<div className="grid gap-4 text-sm text-neutral-700 md:grid-cols-2">
									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-neutral-500" />
										<div>
											<div className="font-medium">
												{dt.toLocaleDateString("en-US", {
													weekday: "long",
													month: "long",
													day: "numeric",
													year: "numeric",
												})}
											</div>
											<div className="text-xs text-neutral-500">
												{dt.toLocaleTimeString("en-US", {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<MapPin className="h-5 w-5 text-neutral-500" />
										<div className="font-medium">{event.location}</div>
									</div>
								</div>

								{/* Description */}
								{event.description && (
									<div>
										<h2 className="text-lg font-semibold mb-1">About this event</h2>
										<p className="whitespace-pre-line text-neutral-700">
											{event.description}
										</p>
									</div>
								)}

								{/* Tickets */}
								{event.isPaidEvent && availableTickets.length > 0 && (
									<div className="space-y-4">
										<h2 className="text-lg font-semibold">Tickets</h2>
										<div className="space-y-2">
											{availableTickets.map((ticket) => {
												const remaining =
													ticket.capacity != null
														? Math.max(ticket.capacity - ticket.sold, 0)
														: null;
												const soldOut = remaining !== null && remaining <= 0;

												return (
													<button
														key={ticket.id}
														type="button"
														onClick={() => !soldOut && setSelectedTicketId(ticket.id)}
														disabled={soldOut}
														className={`flex w-full items-start justify-between rounded border px-4 py-3 text-left ${
															selectedTicketId === ticket.id && !soldOut
																? " bg-white/80 shadow-lg border-black/20"
																: "border-white/50 bg-neutral-50"
														} ${
															soldOut
																? "opacity-60 cursor-not-allowed"
																: "hover:border-black/20"
														}`}
													>
														<div>
															<div className="font-medium">{ticket.name}</div>
															{ticket.description && (
																<div className="text-sm text-neutral-700">
																	{ticket.description}
																</div>
															)}
															{remaining !== null && (
																<div className="text-xs text-neutral-500">
																	{soldOut ? "Sold out" : `${remaining} tickets left`}
																</div>
															)}
														</div>
														<div className="ml-4 text-sm font-semibold">${ticket.price}</div>
													</button>
												);
											})}
										</div>

										{/* Quantity + CTA */}
										{selectedTicket && (
											<div className="flex flex-col gap-3 pt-2">
												<div className="flex items-center gap-3">
													<span className="text-sm font-medium">Qty:</span>
													<input
														type="number"
														min={1}
														max={ticketsLeft ?? undefined}
														value={quantity}
														onChange={(e) => {
															const v = Number(e.target.value) || 1;
															if (ticketsLeft != null && v > ticketsLeft) {
																setQuantity(ticketsLeft);
															} else {
																setQuantity(v);
															}
														}}
														className="w-20 rounded border px-2 py-1 text-sm"
													/>
													{ticketsLeft != null && (
														<span className="text-xs text-neutral-500">
															Max {ticketsLeft}
														</span>
													)}
												</div>

												{/* Checkout CTA */}
												<div className="mt-6 flex flex-col gap-4">
													{/* Reservation & Cancellation Policy */}
													<div className="rounded border bg-white p-3 text-xs text-neutral-700 space-y-2">
														<p className="font-semibold">
															Reservation & Cancellation Policy – Friends VA
														</p>
														<p>
															At Friends VA, we are committed to providing our guests with
															exceptional service and a premium dining, daytime, and nightlife
															experience. In order to prepare for your arrival and ensure a
															smooth experience for all, we kindly ask that you review and
															acknowledge our reservation and cancellation policy:
														</p>
														<p>
															There will be a{" "}
															<span className="font-semibold">$250 cleaning fee</span> for
															tables/groups requiring excessive cleaning due to inappropriate
															conduct, such as (but not limited to): vomiting, cake fights,
															intentional pouring of liquor on tables or the floor. We will do
															our best to charge the individual responsible. However, if that’s
															not possible, the entire table will be equally responsible for
															the total fee.
														</p>
														<p className="font-semibold">
															Pre-Payment &amp; Cancellation Terms
														</p>
														<p>
															All reservations requiring pre-payment are{" "}
															<span className="font-semibold">
																non-refundable and non-transferable
															</span>
															. This includes, but is not limited to, circumstances involving
															late arrivals, no-shows, changes in guest count, or cancellations
															for any reason.
														</p>
														<p>
															If you have any questions regarding your reservation, please
															contact us: &nbsp;📞 202.403.7994 &nbsp; 📧 info@FriendsVA.com
														</p>
														<p>All guests must be 21+ years of age.</p>
														<p>
															There are{" "}
															<span className="font-semibold">no refunds or credits</span> for
															prepayments under any circumstances, including no-shows or late
															arrivals.
														</p>

														{/* Checkbox */}
														<label className="mt-2 flex items-start gap-2">
															<input
																type="checkbox"
																className="mt-0.5"
																checked={agreed}
																onChange={(e) => setAgreed(e.target.checked)}
															/>
															<span>
																I have read and agree to the Reservation &amp; Cancellation
																Policy.
															</span>
														</label>
													</div>

													<Button
														className="w-full md:w-auto"
														disabled={!agreed}
														onClick={() => {
															if (!agreed) return;
															// 1) create reservation + ticket line
															// 2) redirect to payment
														}}
													>
														Proceed to payment
													</Button>

													{!agreed && (
														<p className="text-xs text-red-600">
															You must agree to the Reservation &amp; Cancellation Policy
															before checking out.
														</p>
													)}

													<p className="text-xs text-neutral-600">
														Looking for more?{" "}
														<Link href="/reserve" className="font-medium text-orange-500 underline">
															Continue shopping
														</Link>
													</p>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
