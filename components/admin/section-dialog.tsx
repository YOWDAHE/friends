"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { MenuSection } from "@/types/menu";
import { Spinner } from "@/components/ui/spinner";

interface SectionDialogProps {
	children: React.ReactNode;
	section?: MenuSection | null;
	onSave: (data: { name: string; slug?: string; imageUrl?: string }) => void;
}

export function SectionDialog({
	children,
	section,
	onSave,
}: SectionDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({ name: "", imageUrl: "" });
	const [selectedFileName, setSelectedFileName] = useState("");
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (section) {
			setFormData({ name: section.name, imageUrl: section.imageUrl || "" });
		} else {
			setFormData({ name: "", imageUrl: "" });
		}
		setSelectedFileName("");
	}, [section, open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
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

			const res = await fetch("/api/admin/upload/menu-section-image", {
				method: "POST",
				body: fd,
			});

			if (!res.ok) throw new Error("Upload failed");

			const { url, publicId } = (await res.json()) as {
				url: string;
				publicId: string;
			};

			setFormData((prev) => ({ ...prev, imageUrl: url, imagePublicId: publicId }));
		} catch (err) {
			console.error("Error uploading section image:", err);
		} finally {
			setUploading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{section ? "Edit Section" : "Add Menu Section"}</DialogTitle>
					<DialogDescription>
						{section
							? "Update the section details."
							: "Create a new section within this category."}
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
						<Label htmlFor="name">Section Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Happy Hour Bites"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="image">Section Image</Label>
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
						{formData.imageUrl && (
							<img
								src={formData.imageUrl}
								alt="Section preview"
								className="mt-2 h-16 w-16 rounded object-cover"
							/>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={uploading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={uploading}>
							{section ? "Save Changes" : "Add Section"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
