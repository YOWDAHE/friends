"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { MenuItemDialog } from "@/components/admin/menu-item-dialog"
import { CategoryDialog } from "@/components/admin/category-dialog"
import { SectionDialog } from "@/components/admin/section-dialog"

// Mock menu data
const initialMenuData = [
  {
    id: "happy-hour",
    name: "Happy Hour",
    tagline: "Daily 3-6 PM",
    sections: [
      {
        id: "hh-bites",
        name: "Happy Hour Bites",
        imageUrl: "/happy-hour-bites.png",
        items: [
          { id: "1", name: "Truffle Fries", price: "$8", description: "Crispy fries with truffle oil", visible: true },
          {
            id: "2",
            name: "Buffalo Wings",
            price: "$12",
            description: "Spicy chicken wings with blue cheese",
            visible: true,
          },
          { id: "3", name: "Calamari", price: "$14", description: "Lightly fried with marinara", visible: true },
        ],
      },
      {
        id: "hh-drinks",
        name: "Happy Hour Drinks",
        imageUrl: "/cocktails.png",
        items: [
          {
            id: "4",
            name: "House Wine",
            price: "$6",
            description: "Red, white, or rosé by the glass",
            visible: true,
          },
          { id: "5", name: "Well Cocktails", price: "$7", description: "Classic cocktails", visible: true },
          { id: "6", name: "Draft Beer", price: "$5", description: "Rotating selection", visible: true },
        ],
      },
    ],
  },
  {
    id: "appetizers",
    name: "Appetizers",
    tagline: "Start your meal",
    sections: [
      {
        id: "starters",
        name: "Starters",
        imageUrl: "/appetizers.png",
        items: [
          {
            id: "7",
            name: "Burrata & Tomatoes",
            price: "$16",
            description: "Fresh burrata with heirloom tomatoes",
            visible: true,
          },
          {
            id: "8",
            name: "Tuna Tartare",
            price: "$18",
            description: "Ahi tuna with avocado and crispy wonton",
            visible: true,
          },
        ],
      },
    ],
  },
  {
    id: "entrees",
    name: "Entrees",
    tagline: "Main courses",
    sections: [
      {
        id: "mains",
        name: "Main Dishes",
        imageUrl: "/entrees.png",
        items: [
          {
            id: "9",
            name: "Ribeye Steak",
            price: "$42",
            description: "12oz ribeye with roasted vegetables",
            visible: true,
          },
          {
            id: "10",
            name: "Salmon Fillet",
            price: "$32",
            description: "Pan-seared salmon with lemon butter",
            visible: true,
          },
          {
            id: "11",
            name: "Chicken Parmesan",
            price: "$28",
            description: "Breaded chicken with marinara",
            visible: false,
          },
        ],
      },
    ],
  },
]

export default function MenuPage() {
  const [menuData, setMenuData] = useState(initialMenuData)
  const [selectedCategory, setSelectedCategory] = useState(initialMenuData[0])
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingSection, setEditingSection] = useState<any>(null)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)

  const handleSaveCategory = (categoryData: any) => {
    setMenuData([...menuData, { ...categoryData, id: Date.now().toString(), sections: [] }])
    setIsCategoryDialogOpen(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setMenuData(menuData.filter((c) => c.id !== categoryId))
    if (selectedCategory.id === categoryId) {
      setSelectedCategory(menuData[0])
    }
  }

  const handleSaveSection = (sectionData: any) => {
    setMenuData(
      menuData.map((cat) => {
        if (cat.id === selectedCategory.id) {
          if (editingSection) {
            return {
              ...cat,
              sections: cat.sections.map((s) => (s.id === editingSection.id ? { ...sectionData, id: s.id } : s)),
            }
          } else {
            return {
              ...cat,
              sections: [...cat.sections, { ...sectionData, id: Date.now().toString(), items: [] }],
            }
          }
        }
        return cat
      }),
    )
    setEditingSection(null)
    setIsSectionDialogOpen(false)
  }

  const handleDeleteSection = (sectionId: string) => {
    setMenuData(
      menuData.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return { ...cat, sections: cat.sections.filter((s) => s.id !== sectionId) }
        }
        return cat
      }),
    )
  }

  const handleSaveItem = (itemData: any) => {
    setMenuData(
      menuData.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            sections: cat.sections.map((section) => {
              if (section.id === currentSectionId) {
                if (editingItem) {
                  return {
                    ...section,
                    items: section.items.map((item) =>
                      item.id === editingItem.id ? { ...itemData, id: item.id } : item,
                    ),
                  }
                } else {
                  return { ...section, items: [...section.items, { ...itemData, id: Date.now().toString() }] }
                }
              }
              return section
            }),
          }
        }
        return cat
      }),
    )
    setEditingItem(null)
    setCurrentSectionId(null)
    setIsItemDialogOpen(false)
  }

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setMenuData(
      menuData.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            sections: cat.sections.map((section) => {
              if (section.id === sectionId) {
                return { ...section, items: section.items.filter((item) => item.id !== itemId) }
              }
              return section
            }),
          }
        }
        return cat
      }),
    )
  }

  const handleToggleItemVisibility = (sectionId: string, itemId: string) => {
    setMenuData(
      menuData.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            sections: cat.sections.map((section) => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  items: section.items.map((item) => (item.id === itemId ? { ...item, visible: !item.visible } : item)),
                }
              }
              return section
            }),
          }
        }
        return cat
      }),
    )
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
							<Button
								size="sm"
								variant="outline"
								onClick={() => setIsCategoryDialogOpen(true)}
								className="gap-1"
							>
								<Plus className="h-3 w-3" />
								Add
							</Button>
						</div>

						<div className="space-y-1 rounded-lg border bg-white p-2">
							{menuData.map((category) => (
								<div key={category.id} className="group relative">
									<button
										onClick={() => setSelectedCategory(category)}
										className={cn(
											"w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
											selectedCategory.id === category.id
												? "bg-black text-white"
												: "hover:bg-gray-100"
										)}
									>
										<div className="font-medium">{category.name}</div>
										<div className="text-xs opacity-80">{category.tagline}</div>
									</button>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => handleDeleteCategory(category.id)}
										className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>
							))}
						</div>
					</div>

					{/* Sections & Items */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold">{selectedCategory.name}</h3>
							<Button
								onClick={() => {
									setEditingSection(null);
									setIsSectionDialogOpen(true);
								}}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Add Section
							</Button>
						</div>

						{selectedCategory.sections.map((section) => (
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
											<Button
												size="sm"
												variant="outline"
												onClick={() => {
													setEditingSection(section);
													setIsSectionDialogOpen(true);
												}}
											>
												<Pencil className="h-4 w-4" />
											</Button>
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
										<Button
											size="sm"
											onClick={() => {
												setEditingItem(null);
												setCurrentSectionId(section.id);
												setIsItemDialogOpen(true);
											}}
											className="gap-2"
										>
											<Plus className="h-3 w-3" />
											Add Item
										</Button>
									</div>

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
											{section.items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="font-medium">{item.name}</TableCell>
													<TableCell>{item.price}</TableCell>
													<TableCell className="max-w-xs truncate text-gray-600">
														{item.description}
													</TableCell>
													<TableCell>
														<Switch
															checked={item.visible}
															onCheckedChange={() =>
																handleToggleItemVisibility(section.id, item.id)
															}
														/>
													</TableCell>
													<TableCell>
														<div className="flex justify-end gap-2">
															<Button
																variant="ghost"
																size="icon"
																onClick={() => {
																	setEditingItem(item);
																	setCurrentSectionId(section.id);
																	setIsItemDialogOpen(true);
																}}
															>
																<Pencil className="h-4 w-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleDeleteItem(section.id, item.id)}
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
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Dialogs */}
				<CategoryDialog
					open={isCategoryDialogOpen}
					onOpenChange={setIsCategoryDialogOpen}
					onSave={handleSaveCategory}
				/>

				<SectionDialog
					open={isSectionDialogOpen}
					onOpenChange={setIsSectionDialogOpen}
					section={editingSection}
					onSave={handleSaveSection}
				/>

				<MenuItemDialog
					open={isItemDialogOpen}
					onOpenChange={setIsItemDialogOpen}
					item={editingItem}
					onSave={handleSaveItem}
				/>
			</div>
		);
}
