"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type CheckoutTicket = {
	id: number;
	name: string;
	price: string;
	description: string | null;
	capacity: number | null;
	sold: number;
	isActive: boolean;
};

type CheckoutEvent = {
	id: number;
	title: string;
	subtitle: string | null;
	description: string | null;
	dateTime: string;
	location: string;
	imageUrl: string | null;
	isPaidEvent: boolean;
};

const TAX_RATE = 0.05;

export default function CheckoutPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [event, setEvent] = useState<CheckoutEvent | null>(null);
	const [ticket, setTicket] = useState<CheckoutTicket | null>(null);
	const [qty, setQty] = useState(1);
	const [loading, setLoading] = useState(true);
	const [agreed, setAgreed] = useState(false);
	const [creatingSession, setCreatingSession] = useState(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");

	const eventId = searchParams.get("eventId");
	const ticketId = searchParams.get("ticketId");
	const qtyParam = searchParams.get("qty");

	useEffect(() => {
		if (qtyParam) {
			const n = Number(qtyParam);
			if (!Number.isNaN(n) && n > 0) setQty(n);
		}
	}, [qtyParam]);

	useEffect(() => {
		if (!eventId || !ticketId) {
			router.replace("/");
			return;
		}

		const load = async () => {
			try {
				const res = await fetch(`/api/admin/events/${eventId}`);
				if (!res.ok) throw new Error("Failed to load event");
				const data = await res.json();
				const ev: CheckoutEvent = data.event;
				const tickets: CheckoutTicket[] = data.tickets ?? [];
				const t = tickets.find((tk) => tk.id === Number(ticketId)) ?? null;

				setEvent(ev);
				setTicket(t);
			} catch (e) {
				console.error("Error loading checkout data", e);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [eventId, ticketId, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-neutral-50">
				<Spinner />
			</div>
		);
	}

	if (!event || !ticket) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-50">
				<p>Unable to load your selection.</p>
				<Link href="/" className="text-orange-500 underline">
					Back to events
				</Link>
			</div>
		);
	}

	const priceNumber = Number(ticket.price);
	const remaining =
		ticket.capacity != null ? Math.max(ticket.capacity - ticket.sold, 0) : null;
	const soldOut = remaining !== null && remaining <= 0;
	const subtotal = priceNumber * qty;
	const tax = subtotal * TAX_RATE;
	const total = subtotal + tax;
	const invalidQty =
		remaining != null && (qty <= 0 || qty > remaining || soldOut);

	const handlePay = async () => {
		if (invalidQty || !agreed || !event || !ticket || creatingSession) return;
		try {
			setCreatingSession(true);
			const res = await fetch("/api/checkout/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					eventId: event.id,
					ticketId: ticket.id,
					qty,
					name,
					email,
					phone,
					notes,
				}),
			});
			const data = await res.json();
			if (!res.ok || !data.url) {
				console.error("Failed to create checkout session", data);
				setCreatingSession(false);
				return;
			}
			window.location.href = data.url as string;
		} catch (err) {
			console.error("Error starting checkout", err);
			setCreatingSession(false);
		}
	};

	const dt = new Date(event.dateTime);

	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
				{/* Top bar */}
				<div className="mb-6 flex items-center justify-between">
					<Link
						href="/"
						className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center justify-center gap-4"
					>
						<ArrowLeft className="size-6" /> Back
					</Link>
					<span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
						Secure checkout
					</span>
				</div>

				{/* Two-column layout */}
				<div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-start">
					{/* Left: event card */}
					<div className="rounded-2xl bg-white shadow-sm border border-neutral-100 overflow-hidden">
						{event.imageUrl && (
							<div className="relative h-56 w-full md:h-72">
								<Image
									src={event.imageUrl}
									alt={event.title}
									fill
									className="object-cover"
								/>
							</div>
						)}
						<div className="space-y-4 p-5 md:p-6">
							<div className="space-y-1">
								<h1 className="text-xl md:text-2xl font-semibold">{event.title}</h1>
								{event.subtitle && (
									<p className="text-sm text-neutral-600">{event.subtitle}</p>
								)}
							</div>

							<div className="grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
								<div>
									<div className="font-medium">Date &amp; time</div>
									<div>
										{dt.toLocaleDateString("en-US", {
											weekday: "long",
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</div>
									<div className="text-xs text-neutral-500">
										{dt.toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
										})}
										{"  "}– Until
									</div>
								</div>
								<div>
									<div className="font-medium">Location</div>
									<div>{event.location}</div>
								</div>
							</div>

							{event.description && (
								<div className="pt-2 border-t border-neutral-100">
									<div className="mb-1 text-sm font-medium text-neutral-800">
										About this event
									</div>
									<p className="text-sm text-neutral-700 line-clamp-4 md:line-clamp-6 whitespace-pre-line">
										{event.description}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Right: order + payment */}
					<div className="space-y-6">
						{/* Order summary */}
						<div className="rounded-2xl bg-white shadow-sm border border-neutral-100 p-5 md:p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-base font-semibold">Order summary</h2>
								<button
									type="button"
									className="text-xs text-neutral-500 hover:text-neutral-800"
									onClick={() => router.back()}
								>
									Remove
								</button>
							</div>

							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<div>
										<div className="font-medium">{ticket.name}</div>
										<div className="text-xs text-neutral-600">
											Ticket Options:: {ticket.name}
											{remaining !== null && !soldOut
												? `: ${remaining} Tickets left`
												: soldOut
												? ": Sold out"
												: ""}
										</div>
									</div>
									<div className="text-sm font-medium">${priceNumber.toFixed(2)}</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs uppercase tracking-wide text-neutral-500">
										Quantity
									</span>
									<select
										value={qty}
										onChange={(e) => setQty(Number(e.target.value))}
										className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs"
									>
										{Array.from(
											{ length: Math.min(remaining ?? 10, 10) || 10 },
											(_, i) => i + 1
										).map((n) => (
											<option key={n} value={n}>
												{n}
											</option>
										))}
									</select>
								</div>

								<hr className="border-neutral-100" />

								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>${subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Food and Beverage Tax (5%)</span>
										<span>${tax.toFixed(2)}</span>
									</div>
									<div className="mt-2 flex justify-between text-base font-semibold">
										<span>Total</span>
										<span>${total.toFixed(2)}</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							{/* Guest details */}
							<div className="rounded-2xl bg-white shadow-sm border border-neutral-100 p-5 md:p-6 space-y-3 text-xs text-neutral-700">
								<p className="font-semibold text-sm">Guest details</p>
								<div className="grid gap-3 md:grid-cols-2">
									<div className="space-y-1">
										<label className="block text-[11px] uppercase tracking-wide text-black">
											Name
										</label>
										<input
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
											placeholder="Full name"
										/>
									</div>
									<div className="space-y-1">
										<label className="block text-[11px] uppercase tracking-wide text-black">
											Email
										</label>
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
											placeholder="you@example.com"
										/>
									</div>
									<div className="space-y-1">
										<label className="block text-[11px] uppercase tracking-wide text-black">
											Phone
										</label>
										<input
											type="tel"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
											placeholder="(555) 555-5555"
										/>
									</div>
									<div className="space-y-1 md:col-span-2">
										<label className="block text-[11px] uppercase tracking-wide text-black">
											Notes (optional)
										</label>
										<textarea
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											rows={3}
											className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
											placeholder="Add any special requests or notes for the host"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Policy + checkbox */}
						<div className="rounded-2xl bg-white shadow-sm border border-neutral-100 p-5 md:p-6 space-y-3 text-xs text-neutral-700">
							<p className="font-semibold">
								Reservation &amp; Cancellation Policy – Friends VA
							</p>
							<p>
								At Friends VA, we are committed to providing our guests with exceptional
								service and a premium dining, daytime, and nightlife experience. In
								order to prepare for your arrival and ensure a smooth experience for
								all, we kindly ask that you review and acknowledge our reservation and
								cancellation policy:
							</p>
							<p>
								There will be a <span className="font-semibold">$250 cleaning fee</span>{" "}
								for tables/groups requiring excessive cleaning due to inappropriate
								conduct, such as (but not limited to): vomiting, cake fights,
								intentional pouring of liquor on tables or the floor. We will do our
								best to charge the individual responsible. However, if that’s not
								possible, the entire table will be equally responsible for the total
								fee.
							</p>
							<p className="font-semibold">Pre-Payment &amp; Cancellation Terms</p>
							<p>
								All reservations requiring pre-payment are{" "}
								<span className="font-semibold">
									non-refundable and non-transferable
								</span>
								. This includes, but is not limited to, circumstances involving late
								arrivals, no-shows, changes in guest count, or cancellations for any
								reason.
							</p>
							<p>
								If you have any questions regarding your reservation, please contact us:
								📞 202.403.7994 &nbsp; 📧 info@FriendsVA.com
							</p>
							<p>All guests must be 21+ years of age.</p>
							<p>
								There are <span className="font-semibold">no refunds or credits</span>{" "}
								for prepayments under any circumstances, including no-shows or late
								arrivals.
							</p>

							<label className="mt-1 flex items-start gap-2">
								<input
									type="checkbox"
									className="mt-0.5"
									checked={agreed}
									onChange={(e) => setAgreed(e.target.checked)}
								/>
								<span>
									I have read and agree to the Reservation &amp; Cancellation Policy.
								</span>
							</label>
						</div>

						{/* Pay button */}
						<div className="space-y-2">
							<Button
								className="w-full"
								disabled={
									invalidQty ||
									!agreed ||
									creatingSession ||
									!name.trim() ||
									!email.trim() ||
									!phone.trim()
								}
								onClick={handlePay}
							>
								{creatingSession ? "Redirecting..." : "Pay now"}
							</Button>

							{invalidQty && (
								<p className="text-xs text-red-600">
									Selected quantity is no longer available. Please adjust the quantity or
									choose another ticket.
								</p>
							)}
							{(name.trim() == "" || email.trim() == "" || phone.trim() == "") && (
								<p className="text-xs text-red-600">
									Please fill out you credentials first.
								</p>
							)}
							{!agreed && (
								<p className="text-xs text-red-600">
									You must agree to the Reservation &amp; Cancellation Policy before
									checking out.
								</p>
							)}
							<p className="text-xs text-neutral-600">
								Looking for more?{" "}
								<Link href="/" className="font-medium text-orange-500 underline">
									Continue shopping
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
