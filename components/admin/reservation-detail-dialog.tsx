"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	User,
	Mail,
	Phone,
	Users,
	Calendar,
	FileText,
	DollarSign,
	Ticket,
	CreditCard,
	CheckCircle,
	Clock,
} from "lucide-react";

interface ReservationDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	reservation: any;
	onStatusChange?: (id: string, status: string) => void;
}

type ApiResponse = {
	reservation: {
		reservation: {
			id: number;
			eventId: number;
			name: string;
			email: string;
			phone: string;
			partySize: number;
			notes: string | null;
			status: string;
			createdAt: string;
		};
		event: {
			id: number;
			title: string;
			subtitle: string | null;
			description: string | null;
			dateTime: string;
			location: string;
			imageUrl: string | null;
		};
	};
	tickets: Array<{
		line: {
			id: number;
			reservationId: number;
			ticketId: number;
			quantity: number;
			unitPrice: string;
			totalPrice: string;
		};
		ticket: {
			id: number;
			name: string;
			description: string | null;
			price: string;
		};
	}>;
	payments: Array<{
		id: number;
		amount: string;
		currency: string;
		status: string;
		provider: string;
		providerPaymentId: string | null;
		description: string | null;
		createdAt: string;
	}>;
};

export function ReservationDetailDialog({
	open,
	onOpenChange,
	reservation,
	onStatusChange,
}: ReservationDetailDialogProps) {
	const [data, setData] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState(false);

	// Fetch full reservation details on open
	useEffect(() => {
		if (open && reservation.id) {
			const loadDetails = async () => {
				try {
					setLoading(true);
					const res = await fetch(`/api/admin/reservations/${reservation.id}`);
					if (!res.ok) throw new Error("Failed to load details");
					const apiData: ApiResponse = await res.json();
					setData(apiData);
				} catch (e) {
					console.error("Error loading reservation details", e);
				} finally {
					setLoading(false);
				}
			};

			loadDetails();
		}
	}, [open, reservation.id]);

	const getStatusVariant = (status: string) => {
		switch (status?.toLowerCase()) {
			case "confirmed":
			case "succeeded":
				return "default";
			case "pending":
				return "secondary";
			case "cancelled":
				return "destructive";
			default:
				return "secondary";
		}
	};

	if (!data) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[600px]">
					<div className="flex items-center justify-center py-8">
						<div className="text-sm text-gray-500">Loading details...</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	const { reservation: resData, event } = data.reservation;
	const firstPayment = data.payments[0] || null;
	const ticketLines = data.tickets || [];

	const totalAmount = ticketLines.reduce(
		(sum, line) => sum + parseFloat(line.line.totalPrice),
		0
	);

	const eventDate = event.dateTime ? new Date(event.dateTime) : null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Reservation Details</DialogTitle>
					<DialogDescription>
						Complete information for reservation #{resData.id}
					</DialogDescription>
				</DialogHeader>

				{loading ? (
					<div className="flex items-center justify-center py-8">
						<div className="text-sm text-gray-500">Loading details...</div>
					</div>
				) : (
					<div className="space-y-6">
						{/* Status Badge */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-gray-700">Status:</span>
								<Badge variant={getStatusVariant(resData.status)}>
									{resData.status}
								</Badge>
							</div>
							{firstPayment && (
								<Badge
									variant={getStatusVariant(firstPayment.status)}
									className="gap-1"
								>
									<DollarSign className="h-3 w-3" />
									{firstPayment.status}
								</Badge>
							)}
						</div>

						{/* Guest Information */}
						<div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
							<div className="mb-4 flex items-center gap-2">
								<User className="h-5 w-5 text-blue-500" />
								<h3 className="text-lg font-semibold text-gray-900">
									Guest Information
								</h3>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium text-gray-700">Name</span>
									<p className="mt-1 font-semibold text-gray-900">{resData.name}</p>
								</div>
								<div>
									<span className="font-medium text-gray-700">Email</span>
									<p className="mt-1 text-gray-900">{resData.email}</p>
								</div>
								<div>
									<span className="font-medium text-gray-700">Phone</span>
									<p className="mt-1 text-gray-900">{resData.phone}</p>
								</div>
								<div>
									<span className="font-medium text-gray-700">Created</span>
									<p className="mt-1 text-gray-900">
										{new Date(resData.createdAt).toLocaleString()}
									</p>
								</div>
							</div>
						</div>

						{/* Event & Tickets */}
						<div className="space-y-4">
							<div className="rounded-xl border bg-gradient-to-r from-emerald-50 to-green-50 p-6">
								<div className="mb-4 flex items-center gap-2">
									<Calendar className="h-5 w-5 text-emerald-500" />
									<h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div className="md:col-span-2">
										<span className="font-medium text-gray-700">Event</span>
										<p className="mt-1 font-semibold text-gray-900">{event.title}</p>
										{event.subtitle && (
											<p className="mt-1 text-sm text-gray-600">{event.subtitle}</p>
										)}
									</div>
									<div>
										<span className="font-medium text-gray-700">Date & Time</span>
										<p className="mt-1">
											{eventDate?.toLocaleDateString("en-US", {
												weekday: "long",
												month: "long",
												day: "numeric",
												year: "numeric",
											}) || "TBD"}
										</p>
										<p className="mt-1 text-sm text-gray-600">
											{eventDate?.toLocaleTimeString("en-US", {
												hour: "numeric",
												minute: "2-digit",
											}) || ""}
										</p>
									</div>
									<div>
										<span className="font-medium text-gray-700">Location</span>
										<p className="mt-1 text-gray-900">{event.location}</p>
									</div>
								</div>
							</div>

							{ticketLines.length > 0 && (
								<div className="rounded-xl border bg-white p-6">
									<div className="mb-4 flex items-center gap-2">
										<Ticket className="h-5 w-5 text-orange-500" />
										<h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
									</div>
									<div className="space-y-3">
										{ticketLines.map((line) => (
											<div
												key={line.line.id}
												className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
											>
												<div>
													<div className="font-medium text-sm">{line.ticket.name}</div>
													{line.ticket.description && (
														<div className="text-xs text-gray-500">
															{line.ticket.description}
														</div>
													)}
													<div className="text-xs text-gray-500">
														Qty: {line.line.quantity} × ${line.line.unitPrice}
													</div>
												</div>
												<div className="font-semibold text-sm">${line.line.totalPrice}</div>
											</div>
										))}
										<div className="pt-3 border-t border-gray-200 flex justify-between items-center font-semibold text-lg">
											<span>Total</span>
											<span>${totalAmount.toFixed(2)}</span>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Payment Information */}
						{firstPayment && (
							<div className="rounded-xl border bg-gradient-to-r from-purple-50 to-pink-50 p-6">
								<div className="mb-4 flex items-center gap-2">
									<CreditCard className="h-5 w-5 text-purple-500" />
									<h3 className="text-lg font-semibold text-gray-900">
										Payment Information
									</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium text-gray-700">Status</span>
										<div className="mt-1 flex items-center gap-2">
											<Badge variant={getStatusVariant(firstPayment.status)}>
												{firstPayment.status}
											</Badge>
										</div>
									</div>
									<div>
										<span className="font-medium text-gray-700">Amount</span>
										<p className="mt-1 font-semibold text-gray-900">
											{firstPayment.currency.toUpperCase()} {firstPayment.amount}
										</p>
									</div>
									<div className="md:col-span-2">
										<span className="font-medium text-gray-700">Payment ID</span>
										<p className="mt-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
											{firstPayment.providerPaymentId || "N/A"}
										</p>
									</div>
									<div>
										<span className="font-medium text-gray-700">Provider</span>
										<p className="mt-1 text-gray-900 capitalize">
											{firstPayment.provider}
										</p>
									</div>
									<div>
										<span className="font-medium text-gray-700">Paid</span>
										<p className="mt-1 text-gray-900">
											{new Date(firstPayment.createdAt).toLocaleString()}
										</p>
									</div>
									{firstPayment.description && (
										<div className="md:col-span-2">
											<span className="font-medium text-gray-700">Description</span>
											<p className="mt-1 text-sm text-gray-900">
												{firstPayment.description}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Special Notes */}
						{resData.notes && resData.notes.trim() && (
							<div className="rounded-xl border bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
								<div className="mb-4 flex items-center gap-2">
									<FileText className="h-5 w-5 text-yellow-500" />
									<h3 className="text-lg font-semibold text-gray-900">Special Notes</h3>
								</div>
								<p className="text-sm text-gray-800 whitespace-pre-wrap">
									{resData.notes}
								</p>
							</div>
						)}
					</div>
				)}

				<DialogFooter className="flex-col gap-2 sm:flex-row">
					{onStatusChange && resData.status === "PENDING" && (
						<>
							<Button
								variant="outline"
								onClick={() => {
									onStatusChange(resData.id.toString(), "CANCELLED");
									onOpenChange(false);
								}}
								className="border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
							>
								Cancel Reservation
							</Button>
							<Button
								onClick={() => {
									onStatusChange(resData.id.toString(), "CONFIRMED");
									onOpenChange(false);
								}}
								className="flex-1 sm:flex-none"
							>
								Confirm Reservation
							</Button>
						</>
					)}
					{/* {onStatusChange && resData.status === "CONFIRMED" && (
						<Button
							variant="outline"
							onClick={() => {
								onStatusChange(resData.id.toString(), "CANCELLED");
								onOpenChange(false);
							}}
							className="border-red-200 text-red-600 hover:bg-red-50 w-full sm:w-auto"
						>
							Cancel Reservation
						</Button>
					)} */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
