"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MenuItemDialog } from "@/components/admin/menu-item-dialog";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { SectionDialog } from "@/components/admin/section-dialog";
import type { MenuCategory, MenuSection, MenuItem } from "@/types/menu";
import { Spinner } from "@/components/ui/spinner";
import { useConfirm } from "@/app/components/UseConfirm";
import { EditCategoryDialog } from "@/components/admin/EditCategoryDialog";

export default function MenuPage() {
	const { confirm, ConfirmDialog } = useConfirm();
	const [menuData, setMenuData] = useState<MenuCategory[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(
		null
	);
	const [sections, setSections] = useState<MenuSection[]>([]);
	// const [items, setItems] = useState<MenuItem[]>([]);
	const [itemsBySection, setItemsBySection] = useState<
		Record<number, MenuItem[]>
	>({});
	const [loadingItemsForSection, setLoadingItemsForSection] = useState<
		number | null
	>(null);
	const [sectionNeedingItems, setSectionNeedingItems] = useState<number | null>(
		null
	);

	const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
	const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
	const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
	const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
	const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingSections, setLoadingSections] = useState(false);
	const [loadingItems, setLoadingItems] = useState(false);
	const [currentSectionForItems, setCurrentSectionForItems] =
		useState<MenuSection | null>(null);

	// Fetch categories
	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/admin/menu/categories");
			if (!res.ok) throw new Error("Failed to fetch categories");
			const { categories } = (await res.json()) as { categories: MenuCategory[] };
			setMenuData(categories);
			if (categories.length > 0) {
				setSelectedCategory(categories[0]);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch sections when category changes
	useEffect(() => {
		if (selectedCategory) {
			fetchSections(selectedCategory.id);
		}
	}, [selectedCategory]);

	const handleSaveCategory = async (categoryData: {
		name: string;
		tagline?: string;
	}) => {
		try {
			const slug = categoryData.name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
			const res = await fetch("/api/admin/menu/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					slug,
					name: categoryData.name,
					tagline: categoryData.tagline || null,
					sortOrder: menuData.length,
				}),
			});

			if (!res.ok) throw new Error("Failed to save category");
			const { category } = (await res.json()) as { category: MenuCategory };

			setMenuData([...menuData, category]);
			setSelectedCategory(category);
		} catch (error) {
			console.error("Error saving category:", error);
		}
		setIsCategoryDialogOpen(false);
	};

	const handleUpdateCategory = async (
		id: number,
		categoryData: { name: string; tagline?: string }
	) => {
		try {
			const slug = categoryData.name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");

			const res = await fetch(`/api/admin/menu/categories/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					slug,
					name: categoryData.name,
					tagline: categoryData.tagline || null,
				}),
			});

			if (!res.ok) throw new Error("Failed to update category");
			const { category } = (await res.json()) as { category: MenuCategory };

			setMenuData((prev) =>
				prev.map((c) => (c.id === category.id ? category : c))
			);
			if (selectedCategory?.id === category.id) {
				setSelectedCategory(category);
			}
		} catch (error) {
			console.error("Error updating category:", error);
		}
	};

	const handleDeleteCategory = async (categoryId: number) => {
		const ok = await confirm({
			title: "Delete category?",
			message:
				"This will also remove its sections and items. This action cannot be undone.",
		});
		if (!ok) return;
		try {
			const res = await fetch(`/api/admin/menu/categories/${categoryId}`, {
				method: "DELETE",
			});

			if (!res.ok) throw new Error("Failed to delete category");

			const newCategories = menuData.filter((c) => c.id !== categoryId);
			setMenuData(newCategories);

			if (selectedCategory?.id === categoryId) {
				setSelectedCategory(newCategories[0] || null);
			}
		} catch (error) {
			console.error("Error deleting category:", error);
		}
	};

	const handleSaveSection = async (sectionData: {
		name: string;
		slug?: string;
		imageUrl?: string;
		imagePublicId?: string;
	}) => {
		if (!selectedCategory) return;

		try {
			const slug =
				sectionData.slug ||
				sectionData.name
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[^a-z0-9-]/g, "");

			const isEdit = !!editingSection;

			const url = isEdit
				? `/api/admin/menu/sections/${editingSection!.id}`
				: "/api/admin/menu/sections";

			const method = isEdit ? "PATCH" : "POST";

			const body = isEdit
				? {
						slug,
						name: sectionData.name,
						imageUrl: sectionData.imageUrl ?? editingSection!.imageUrl ?? null,
						imagePublicId:
							sectionData.imagePublicId ??
							(editingSection as any).imagePublicId ??
							null,
				  }
				: {
						categoryId: selectedCategory.id,
						slug,
						name: sectionData.name,
						imageUrl: sectionData.imageUrl || null,
						imagePublicId: sectionData.imagePublicId || null,
						sortOrder: sections.length,
				  };

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error("Failed to save section");

			const result = await res.json();
			const savedSection: MenuSection = (result.section ?? result) as MenuSection;

			if (isEdit) {
				setSections((prev) =>
					prev.map((s) => (s.id === savedSection.id ? savedSection : s))
				);
			} else {
				setSections((prev) => [...prev, savedSection]);
			}

			setEditingSection(null);
		} catch (error) {
			console.error("Error saving section:", error);
		}
		setIsSectionDialogOpen(false);
	};

	const handleDeleteSection = async (sectionId: number) => {
		const ok = await confirm({
			title: "Delete section?",
			message: "This will also remove all items in this section.",
		});
		if (!ok) return;
		try {
			const res = await fetch(`/api/admin/menu/sections/${sectionId}`, {
				method: "DELETE",
			});

			if (!res.ok) throw new Error("Failed to delete section");

			setSections(sections.filter((s) => s.id !== sectionId));
			// setItems([]);
		} catch (error) {
			console.error("Error deleting section:", error);
		}
	};

	const fetchItems = useCallback(async (sectionId: number) => {
		console.log("fetching items?");
		try {
			setLoadingItemsForSection(sectionId);
			console.log("Items: ", sectionId);
			const res = await fetch(`/api/admin/menu/items?sectionId=${sectionId}`);
			if (!res.ok) throw new Error("Failed to fetch items");
			const { items } = (await res.json()) as { items: MenuItem[] };

			setItemsBySection((prev) => ({
				...prev,
				[sectionId]: items,
			}));
		} catch (error) {
			console.error("Error fetching items:", error);
		} finally {
			setLoadingItemsForSection(null);
		}
	}, []);

	const fetchSections = useCallback(
		async (categoryId: number) => {
			try {
				setLoadingSections(true);
				const res = await fetch(
					`/api/admin/menu/sections?categoryId=${categoryId}`
				);
				if (!res.ok) throw new Error("Failed to fetch sections");
				const { sections } = (await res.json()) as { sections: MenuSection[] };
				setSections(sections);

				// After sections load, fetch items for each section in this category
				const sectionIds = sections.map((s) => s.id);

				// Reset items for this category's sections so you don't see stale data
				setItemsBySection((prev) => {
					const next = { ...prev };
					for (const id of sectionIds) delete next[id];
					return next;
				});

				// Fetch all sections' items in parallel
				await Promise.all(sectionIds.map((id) => fetchItems(id)));
			} catch (error) {
				console.error("Error fetching sections:", error);
			} finally {
				setLoadingSections(false);
			}
		},
		[fetchItems]
	);

	useEffect(() => {
		if (sectionNeedingItems == null) return;
		const sectionId = sectionNeedingItems;

		const run = async () => {
			try {
				setLoadingItemsForSection(sectionId);
				const res = await fetch(`/api/admin/menu/items?sectionId=${sectionId}`);
				if (!res.ok) throw new Error("Failed to fetch items");
				const { items } = (await res.json()) as { items: MenuItem[] };

				setItemsBySection((prev) => ({
					...prev,
					[sectionId]: items,
				}));
			} catch (err) {
				console.error("Error fetching items:", err);
			} finally {
				setLoadingItemsForSection(null);
			}
		};

		run();
	}, [sectionNeedingItems]);

	// Call it when clicking a section (add this useEffect or onClick)
	useEffect(() => {
		console.log("Section trigger");
		if (currentSectionForItems) {
			fetchItems(currentSectionForItems.id);
		}
	}, [selectedCategory]);

	const handleSaveItem = async (itemData: {
		name: string;
		price: string;
		description?: string;
		isVisible?: boolean;
	}) => {
		try {
			if (!currentSectionForItems) {
				console.error("No section selected");
				return;
			}
			const sectionId = currentSectionForItems.id;

			const isEdit = !!editingItem;
			const url = isEdit
				? `/api/admin/menu/items/${editingItem!.id}`
				: "/api/admin/menu/items";

			const method = isEdit ? "PATCH" : "POST";

			const body = isEdit
				? {
						name: itemData.name,
						price: itemData.price,
						description: itemData.description || null,
						isVisible: itemData.isVisible ?? true,
						sectionId,
				  }
				: {
						sectionId,
						name: itemData.name,
						price: itemData.price,
						description: itemData.description || null,
						isVisible: itemData.isVisible ?? true,
				  };

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error("Failed to save item");
			const result = await res.json();
			const savedItem: MenuItem = (result.item ?? result) as MenuItem;

			setItemsBySection((prev) => {
				const existing = prev[sectionId] ?? [];
				if (isEdit) {
					return {
						...prev,
						[sectionId]: existing.map((i) =>
							i.id === editingItem!.id ? savedItem : i
						),
					};
				}
				return {
					...prev,
					[sectionId]: [...existing, savedItem],
				};
			});

			setEditingItem(null);
			setCurrentSectionForItems(null);
		} catch (error) {
			console.error("Error saving item:", error);
		}
	};

	const handleDeleteItem = async (itemId: number, sectionId: number) => {
		const ok = await confirm({
			title: "Delete item?",
			message: "This menu item will be removed permanently.",
		});
		if (!ok) return;
		try {
			const res = await fetch(`/api/admin/menu/items/${itemId}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete item");

			setItemsBySection((prev) => ({
				...prev,
				[sectionId]: (prev[sectionId] ?? []).filter((i) => i.id !== itemId),
			}));
		} catch (error) {
			console.error("Error deleting item:", error);
		}
	};

	const handleToggleItemVisibility = async (
		itemId: number,
		visible: boolean,
		sectionId: number
	) => {
		try {
			await fetch(`/api/admin/menu/items/${itemId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isVisible: visible }),
			});

			setItemsBySection((prev) => ({
				...prev,
				[sectionId]: (prev[sectionId] ?? []).map((i) =>
					i.id === itemId ? { ...i, isVisible: visible } : i
				),
			}));
		} catch (error) {
			console.error("Error updating item visibility:", error);
		}
	};

	if (loading) {
		return (
			<div className="p-8 text-center absolute inset-0 flex items-center justify-center">
				{" "}
				<Spinner />
			</div>
		);
	}

	if (!selectedCategory && menuData.length === 0) {
		return (
			<div className="p-8 text-center flex flex-col items-center justify-between gap-8">
				No categories found. Add one to get started!
				<CategoryDialog onSave={handleSaveCategory}>
					<Button size="sm" variant="outline" className="gap-1" type="button">
						<Plus className="h-3 w-3" />
						Add
					</Button>
				</CategoryDialog>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-rage text-4xl md:text-5xl">The Menu</h1>
				<p className="mt-2 text-gray-600">
					Manage menu categories, sections, and items
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
				{/* Category Sidebar */}
				<div className="space-y-3 sticky top-0">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold">Categories</h3>
						<CategoryDialog onSave={handleSaveCategory}>
							<Button size="sm" variant="outline" className="gap-1" type="button">
								<Plus className="h-3 w-3" />
								Add
							</Button>
						</CategoryDialog>
					</div>

					<div className="space-y-1 rounded-lg border bg-white p-2">
						{menuData.map((category) => (
							<div key={category.id} className="group relative">
								<button
									onClick={() => setSelectedCategory(category)}
									className={cn(
										"w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
										selectedCategory?.id === category.id
											? "bg-black text-white"
											: "hover:bg-gray-100"
									)}
								>
									<div className="font-medium">{category.name}</div>
									<div className="text-xs opacity-80">{category.tagline}</div>
								</button>
								<Button
									size="icon"
									// variant="ghost"
									onClick={() => handleDeleteCategory(category.id)}
									className="absolute right-1 top-0 bottom-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer hover:bg-amber-600 my-auto md:p-4"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						))}
					</div>
				</div>

				{/* Sections & Items */}
				<div className="space-y-4">
					{selectedCategory && (
						<>
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold">{selectedCategory.name}</h3>
								<div className="flex items-center justify-center gap-4">
									<EditCategoryDialog
										category={selectedCategory}
										onSave={handleUpdateCategory}
									>
										<Button variant="outline" type="button" className="gap-1">
											<PencilIcon className="h-3 w-3" />
											Edit Category
										</Button>
									</EditCategoryDialog>
									<SectionDialog section={null} onSave={handleSaveSection}>
										<Button
											className="gap-2"
											type="button"
											onClick={() => {
												setEditingSection(null);
											}}
										>
											<Plus className="h-4 w-4" />
											Add Section
										</Button>
									</SectionDialog>
								</div>
							</div>

							{loadingSections ? (
								<div className="flex items-center justify-center w-full h-full">
									<Spinner />
								</div>
							) : (
								sections.map((section) => {
									const sectionItems = itemsBySection[section.id] ?? [];
									return (
										<Card key={section.id}>
											<CardHeader>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-4">
														<img
															src={section.imageUrl || "/placeholder.svg"}
															alt={section.name}
															className="h-16 w-16 rounded-lg object-cover"
														/>
														<CardTitle>{section.name}</CardTitle>
													</div>
													<div className="flex gap-2">
														<SectionDialog section={section} onSave={handleSaveSection}>
															<Button
																size="sm"
																variant="outline"
																type="button"
																onClick={() => {
																	setEditingSection(section);
																}}
															>
																<Pencil className="h-4 w-4" />
															</Button>
														</SectionDialog>
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleDeleteSection(section.id)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="mb-3 flex justify-end">
													{/* ✅ Add Item */}
													<MenuItemDialog item={editingItem} onSave={handleSaveItem}>
														<Button
															size="sm"
															className="gap-2"
															type="button"
															onClick={() => {
																setEditingItem(null);
																setCurrentSectionForItems(section);
															}}
														>
															<Plus className="h-3 w-3" />
															Add Item
														</Button>
													</MenuItemDialog>
												</div>

												{loadingItemsForSection === section.id && !sectionItems ? (
													<div className="flex items-center justify-center w-full h-full">
														<Spinner />
													</div>
												) : (
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Name</TableHead>
																<TableHead>Price</TableHead>
																<TableHead>Description</TableHead>
																<TableHead>Visible</TableHead>
																<TableHead className="text-right">Actions</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{(sectionItems ?? []).map((item) => (
																<TableRow key={item.id}>
																	<TableCell className="font-medium">{item.name}</TableCell>
																	<TableCell>${item.price}</TableCell>
																	<TableCell className="max-w-[100px] truncate text-gray-600">
																		{item.description}
																	</TableCell>
																	<TableCell>
																		<Switch
																			checked={item.isVisible}
																			onCheckedChange={(checked) =>
																				handleToggleItemVisibility(
																					item.id,
																					checked as boolean,
																					section.id
																				)
																			}
																		/>
																	</TableCell>
																	<TableCell>
																		<div className="flex justify-end gap-2">
																			{/* ✅ Edit Item */}
																			<MenuItemDialog item={item} onSave={handleSaveItem}>
																				<Button
																					variant="ghost"
																					size="icon"
																					type="button"
																					onClick={() => {
																						setEditingItem(item);
																						setCurrentSectionForItems(section);
																					}}
																				>
																					<Pencil className="h-4 w-4" />
																				</Button>
																			</MenuItemDialog>

																			{/* Delete button stays normal */}
																			<Button
																				variant="ghost"
																				size="icon"
																				onClick={() => handleDeleteItem(item.id, section.id)}
																				className="text-red-600 hover:bg-red-50 hover:text-red-700"
																			>
																				<Trash2 className="h-4 w-4" />
																			</Button>
																		</div>
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												)}
											</CardContent>
										</Card>
									);
								})
							)}
						</>
					)}
				</div>
			</div>

			{ConfirmDialog}
		</div>
	);
}
