"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import type { EventRecord } from "@/types/events";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "../ui/spinner";

type TicketForm = {
	id?: number;
	name: string;
	price: string;
	description?: string;
	capacity?: number;
	sortOrder?: number;
	isActive?: boolean;
};

interface EventFormDialogProps {
	children: React.ReactNode;
	event?: (EventRecord & { tickets?: TicketForm[] }) | null;
	onSave: (data: {
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
	}) => void;
}

export function EventFormDialog({
	children,
	event,
	onSave,
}: EventFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<{
		title: string;
		subtitle: string;
		date: string;
		time: string;
		location: string;
		description: string;
		imageUrl: string;
		isPublished: boolean;
		isPaidEvent: boolean;
		tickets: TicketForm[];
	}>({
		title: "",
		subtitle: "",
		date: "",
		time: "",
		location: "",
		description: "",
		imageUrl: "",
		isPublished: false,
		isPaidEvent: false,
		tickets: [],
	});

	const [selectedFileName, setSelectedFileName] = useState("");
	const [newPublicId, setNewPublicId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (event) {
			const dt = new Date(event.dateTime);
			const date = dt.toISOString().slice(0, 10);
			const time = dt.toISOString().slice(11, 16);

			setFormData({
				title: event.title,
				subtitle: event.subtitle ?? "",
				date,
				time,
				location: event.location,
				description: event.description ?? "",
				imageUrl: event.imageUrl ?? "",
				isPublished: event.isPublished,
				isPaidEvent: event.isPaidEvent,
				tickets: event.tickets ?? [],
			});
			setNewPublicId(null);
		} else {
			setFormData({
				title: "",
				subtitle: "",
				date: "",
				time: "",
				location: "",
				description: "",
				imageUrl: "",
				isPublished: false,
				isPaidEvent: false,
				tickets: [],
			});
			setNewPublicId(null);
		}
		setSelectedFileName("");
	}, [event, open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.date || !formData.time) return;

		onSave({
			id: event?.id,
			title: formData.title,
			subtitle: formData.subtitle || undefined,
			description: formData.description || undefined,
			date: formData.date,
			time: formData.time,
			location: formData.location,
			imageUrl: formData.imageUrl || event?.imageUrl || undefined,
			isPublished: formData.isPublished,
			isPaidEvent: formData.isPaidEvent,
			imagePublicId: newPublicId ?? event?.imagePublicId ?? undefined,
			tickets: formData.isPaidEvent ? formData.tickets : [],
		});

		setOpen(false);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setSelectedFileName(file.name);
		setUploading(true);

		try {
			const fd = new FormData();
			fd.append("file", file);

			const res = await fetch("/api/admin/upload/event-image", {
				method: "POST",
				body: fd,
			});

			if (!res.ok) throw new Error("Upload failed");

			const { url, publicId } = (await res.json()) as {
				url: string;
				publicId: string;
			};

			setFormData((prev) => ({
				...prev,
				imageUrl: url,
			}));
			setNewPublicId(publicId);
		} catch (err) {
			console.error("Error uploading image:", err);
			toast({
				title: "Image upload failed",
				description: "Please try again.",
				variant: "destructive",
			});
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="relative">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
						<DialogDescription>
							{event
								? "Update the event details below."
								: "Fill in the details to create a new event."}
						</DialogDescription>
					</DialogHeader>

					{uploading && (
						<div className="absolute inset-0 z-10 flex items-center justify-center gap-4 bg-white/80">
							<Spinner />
							<p>Uploading Image...</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Event Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subtitle">Subtitle</Label>
							<Input
								id="subtitle"
								value={formData.subtitle}
								onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<Input
									id="date"
									type="date"
									value={formData.date}
									onChange={(e) => setFormData({ ...formData, date: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="time">Time</Label>
								<Input
									id="time"
									type="time"
									value={formData.time}
									onChange={(e) => setFormData({ ...formData, time: e.target.value })}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) => setFormData({ ...formData, location: e.target.value })}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={4}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="image">Event Image</Label>
							<div className="flex items-center gap-3">
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() => document.getElementById("image")?.click()}
									className="gap-2"
									disabled={uploading}
								>
									<Upload className="h-4 w-4" />
									Choose File
								</Button>
								{selectedFileName && (
									<span className="text-sm text-gray-600">{selectedFileName}</span>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label htmlFor="published">Publish Event</Label>
								<p className="text-sm text-gray-500">
									Make this event visible to the public
								</p>
							</div>
							<Switch
								id="published"
								checked={formData.isPublished}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isPublished: checked })
								}
							/>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label htmlFor="paid">Paid Event</Label>
								<p className="text-sm text-gray-500">Require tickets for this event</p>
							</div>
							<Switch
								id="paid"
								checked={formData.isPaidEvent}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isPaidEvent: checked })
								}
							/>
						</div>

						{formData.isPaidEvent && (
							<div className="space-y-3 rounded-lg border p-4">
								<div className="flex items-center justify-between">
									<Label>Ticket Types</Label>
									<Button
										type="button"
										size="sm"
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												tickets: [
													...prev.tickets,
													{
														name: "",
														price: "",
														description: "",
														capacity: undefined,
														sortOrder: prev.tickets.length,
														isActive: true,
													},
												],
											}))
										}
									>
										Add Ticket
									</Button>
								</div>

								{formData.tickets.map((ticket, index) => (
									<div
										key={ticket.id ?? index}
										className="grid items-start gap-3 sm:grid-cols-[1.3fr_0.8fr_0.8fr_auto]"
									>
										<div className="space-y-1">
											<Label>Name</Label>
											<Input
												value={ticket.name}
												onChange={(e) => {
													const name = e.target.value;
													setFormData((prev) => {
														const tickets = [...prev.tickets];
														tickets[index] = { ...tickets[index], name };
														return { ...prev, tickets };
													});
												}}
												placeholder="General Admission"
												required
											/>
										</div>

										<div className="space-y-1">
											<Label>Price</Label>
											<Input
												value={ticket.price}
												onChange={(e) => {
													const price = e.target.value;
													setFormData((prev) => {
														const tickets = [...prev.tickets];
														tickets[index] = { ...tickets[index], price };
														return { ...prev, tickets };
													});
												}}
												placeholder="19.99"
												required
											/>
										</div>

										<div className="space-y-1">
											<Label>Capacity</Label>
											<Input
												type="number"
												min={1}
												value={ticket.capacity ?? ""}
												onChange={(e) => {
													const raw = e.target.value;
													const capacity = raw === "" ? undefined : Number(raw) || undefined;
													setFormData((prev) => {
														const tickets = [...prev.tickets];
														tickets[index] = { ...tickets[index], capacity };
														return { ...prev, tickets };
													});
												}}
												placeholder="Optional"
											/>
										</div>

										<div className="space-y-1 sm:col-span-4">
											<Label>Description</Label>
											<Textarea
												value={ticket.description ?? ""}
												onChange={(e) => {
													const description = e.target.value;
													setFormData((prev) => {
														const tickets = [...prev.tickets];
														tickets[index] = { ...tickets[index], description };
														return { ...prev, tickets };
													});
												}}
												rows={2}
												placeholder="Short description (optional)"
											/>
										</div>

										<div className="flex items-center justify-between sm:col-span-4">
											<div className="flex items-center gap-2">
												<Switch
													checked={ticket.isActive ?? true}
													onCheckedChange={(checked) =>
														setFormData((prev) => {
															const tickets = [...prev.tickets];
															tickets[index] = {
																...tickets[index],
																isActive: checked,
															};
															return { ...prev, tickets };
														})
													}
												/>
												<span className="text-sm text-gray-600">Active ticket</span>
											</div>
											<Button
												type="button"
												variant="outline"
												onClick={() =>
													setFormData((prev) => ({
														...prev,
														tickets: prev.tickets.filter((_, i) => i !== index),
													}))
												}
											>
												Remove
											</Button>
										</div>
									</div>
								))}
							</div>
						)}

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={uploading}>
								Save Event
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
