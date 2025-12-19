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
import type { MenuItem } from "@/types/menu";

interface MenuItemDialogProps {
	children: React.ReactNode;
	item?: MenuItem | null;
	onSave: (data: {
		name: string;
		price: string;
		description?: string;
		isVisible?: boolean;
	}) => void;
}

export function MenuItemDialog({
	children,
	item,
	onSave,
}: MenuItemDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		description: "",
		isVisible: true,
	});

	useEffect(() => {
		if (item) {
			setFormData({
				name: item.name,
				price: item.price,
				description: item.description || "",
				isVisible: item.isVisible,
			});
		} else {
			setFormData({ name: "", price: "", description: "", isVisible: true });
		}
	}, [item]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const cleanPrice = formData.price.replace(/^\$/, "");
		onSave({ ...formData, price: cleanPrice });
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{item ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
					<DialogDescription>
						{item
							? "Update the menu item details."
							: "Add a new item to this section."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Item Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Truffle Fries"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="price">Price</Label>
						<Input
							id="price"
							value={formData.price}
							onChange={(e) => setFormData({ ...formData, price: e.target.value })}
							placeholder="$12.00"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							placeholder="Brief description of the item..."
							rows={3}
						/>
					</div>

					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<Label htmlFor="visible">Visible on Menu</Label>
							<p className="text-sm text-gray-500">Show this item to customers</p>
						</div>
						<Switch
							id="visible"
							checked={formData.isVisible}
							onCheckedChange={(checked) =>
								setFormData({ ...formData, isVisible: !!checked })
							}
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">{item ? "Save Changes" : "Add Item"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
