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

interface EventFormDialogProps {
	children: React.ReactNode;
	event?: EventRecord | null;
	onSave: (data: {
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
	}) => void;
}

export function EventFormDialog({
	children,
	event,
	onSave,
}: EventFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		subtitle: "",
		date: "",
		time: "",
		location: "",
		description: "",
		imageUrl: "",
		isPublished: false,
		isPaidEvent: false,
	});
	const [selectedFileName, setSelectedFileName] = useState("");
	const [newPublicId, setNewPublicId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const toast = useToast();

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
			});
			setNewPublicId(null);
		}
		setSelectedFileName("");
	}, [event, open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const dateTimeIso = new Date(
			`${formData.date}T${formData.time}:00`
		).toISOString();
		console.log("Saved Form Data: ", formData.imageUrl);
		onSave({
			title: formData.title,
			subtitle: formData.subtitle || undefined,
			description: formData.description || undefined,
			date: formData.date,
			time: formData.time,
			location: formData.location,
			imageUrl: formData.imageUrl || undefined,
			isPublished: formData.isPublished,
			isPaidEvent: formData.isPaidEvent,
			imagePublicId: newPublicId ?? event?.imagePublicId ?? undefined,
		});
		setOpen(false);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setSelectedFileName(file.name);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/admin/upload/event-image", {
				method: "POST",
				body: formData,
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
			// optionally: show toast
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
          {uploading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center gap-4">
            <Spinner />
            <p>Uploading Image...</p>
          </div>}

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

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit">Save Event</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
