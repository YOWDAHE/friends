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

	useEffect(() => {
		if (section) {
			setFormData({ name: section.name, imageUrl: section.imageUrl || "" });
		} else {
			setFormData({ name: "", imageUrl: "" });
		}
		setSelectedFileName("");
	}, [section]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
		setOpen(false);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFileName(file.name);
			console.log("[Section] Selected file:", file.name);
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
							>
								<Upload className="h-4 w-4" />
								Choose File
							</Button>
							{selectedFileName && (
								<span className="text-sm text-gray-600">{selectedFileName}</span>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">{section ? "Save Changes" : "Add Section"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
