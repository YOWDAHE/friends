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
import type { MenuCategory } from "@/types/menu";

interface EditCategoryDialogProps {
	children: React.ReactNode;
	category: MenuCategory | null;
	onSave: (id: number, data: { name: string; tagline?: string }) => void;
}

export function EditCategoryDialog({
	children,
	category,
	onSave,
}: EditCategoryDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({ name: "", tagline: "" });

	useEffect(() => {
		if (category) {
			setFormData({
				name: category.name,
				tagline: category.tagline ?? "",
			});
		}
	}, [category, open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!category) return;
		onSave(category.id, formData);
		setOpen(false);
	};

	if (!category) return <>{children}</>;

	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Category</DialogTitle>
						<DialogDescription>
							Update this category’s name or tagline.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Category Name</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tagline">Tagline</Label>
							<Input
								id="tagline"
								value={formData.tagline}
								onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
							/>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit">Save Changes</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
