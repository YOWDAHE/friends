"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ContactMessage = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	subject: string | null;
	message: string;
	isRead: boolean;
	isArchived: boolean;
	archivedAt: string | null;
	createdAt: string;
};

type Filter = "new" | "all" | "archived";

export default function ContactMessagesPage() {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<Filter>("new");
	const [selected, setSelected] = useState<ContactMessage | null>(null);
	const [archivingId, setArchivingId] = useState<number | null>(null);

	const loadMessages = async (currentFilter: Filter) => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/admin/contact-messages?filter=${currentFilter}`
			);
			if (!res.ok) throw new Error("Failed to load messages");
			const data = (await res.json()) as { messages: ContactMessage[] };
			setMessages(data.messages);
		} catch (e) {
			console.error("Error loading contact messages", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMessages(filter);
	}, [filter]);

	const handleArchive = async (id: number) => {
		try {
			setArchivingId(id);
			const res = await fetch(`/api/admin/contact-messages/${id}/archive`, {
				method: "PATCH",
			});
			if (!res.ok) throw new Error("Failed to archive message");
			const { message } = (await res.json()) as { message: ContactMessage };
			setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
		} catch (e) {
			console.error("Error archiving message", e);
		} finally {
			setArchivingId(null);
		}
	};

	const renderList = (items: ContactMessage[]) => {
		if (loading) {
			return (
				<div className="flex h-full w-full items-center justify-center p-8">
					<Spinner />
				</div>
			);
		}

		if (!items.length) {
			return (
				<p className="text-sm text-gray-500">
					{filter === "archived" ? "No archived messages." : "No messages yet."}
				</p>
			);
		}

		return (
			<div className="space-y-3">
				{items.map((msg) => {
					const created = new Date(msg.createdAt);
					const snippet =
						msg.message.length > 140 ? msg.message.slice(0, 140) + "…" : msg.message;

					return (
						<div key={msg.id} className="rounded-lg border bg-white p-4 md:p-5">
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold">{msg.name}</span>
										{!msg.isArchived && !msg.isRead && (
											<Badge variant="default" className="text-xs">
												New
											</Badge>
										)}
										{msg.isArchived && (
											<Badge variant="secondary" className="text-xs">
												Archived
											</Badge>
										)}
									</div>
									{msg.subject && <p className="text-sm text-gray-700">{msg.subject}</p>}
									<div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
										<span className="inline-flex items-center gap-1">
											<Mail className="h-3 w-3" />
											{msg.email}
										</span>
										{msg.phone && (
											<span className="inline-flex items-center gap-1">
												<Phone className="h-3 w-3" />
												{msg.phone}
											</span>
										)}
										<span className="inline-flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{created.toLocaleString()}
										</span>
									</div>
								</div>

								<div className="flex flex-col items-end gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setSelected(msg)}
										aria-label="View details"
									>
										<Eye className="h-4 w-4" />
									</Button>
									{!msg.isArchived && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleArchive(msg.id)}
											disabled={archivingId === msg.id}
										>
											{archivingId === msg.id ? (
												<>
													<Spinner /> "Archiving..."{" "}
												</>
											) : (
												"Resolved"
											)}
										</Button>
									)}
								</div>
							</div>

							<p className="mt-3 text-sm text-gray-700 line-clamp-2">{snippet}</p>
						</div>
					);
				})}
			</div>
		);
	};

	const filteredMessages =
		filter === "archived"
			? messages.filter((m) => m.isArchived)
			: filter === "new"
			? messages.filter((m) => !m.isArchived)
			: messages;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-rage text-4xl md:text-5xl">Contact messages</h1>
				<p className="mt-2 text-gray-600">
					See messages sent from the contact form.
				</p>
			</div>

			<Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
				<TabsList>
					<TabsTrigger value="new">New</TabsTrigger>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="archived">Archived</TabsTrigger>
				</TabsList>

				<TabsContent value="new" className="mt-4">
					{renderList(filteredMessages)}
				</TabsContent>
				<TabsContent value="all" className="mt-4">
					{renderList(filteredMessages)}
				</TabsContent>
				<TabsContent value="archived" className="mt-4 space-y-3">
					<p className="text-xs text-gray-500">
						Archived messages will be automatically deleted after two weeks.
					</p>
					{renderList(filteredMessages)}
				</TabsContent>
			</Tabs>

			{/* Detail dialog */}
			{selected && (
				<Dialog
					open={!!selected}
					onOpenChange={(open) => !open && setSelected(null)}
				>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>{selected.subject || "Contact message"}</DialogTitle>
							<DialogDescription>
								From {selected.name} &lt;{selected.email}&gt;
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-2 text-sm text-gray-700">
							{selected.phone && (
								<p>
									<span className="font-medium">Phone:</span> {selected.phone}
								</p>
							)}
							<p className="whitespace-pre-line">{selected.message}</p>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
