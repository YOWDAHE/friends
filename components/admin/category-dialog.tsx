"use client";

import { useState } from "react";
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

interface CategoryDialogProps {
	children: React.ReactNode;
	onSave: (data: { name: string; tagline?: string }) => void;
}

export function CategoryDialog({ children, onSave }: CategoryDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({ name: "", tagline: "" });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
		setFormData({ name: "", tagline: "" });
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Menu Category</DialogTitle>
					<DialogDescription>
						Create a new category to organize your menu items.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Category Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Appetizers"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tagline">Tagline</Label>
						<Input
							id="tagline"
							value={formData.tagline}
							onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
							placeholder="Start your meal"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">Add Category</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
