export interface MenuCategory {
    id: number;
    slug: string;
    name: string;
    tagline: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    sections?: MenuSection[];
}

export interface MenuSection {
    id: number;
    categoryId: number;
    slug: string;
    name: string;
    imageUrl: string | null;
    imagePosition: 'left' | 'right';
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    items?: MenuItem[];
}

export interface MenuItem {
    id: number;
    sectionId: number;
    name: string;
    price: string; // Keep as string to match your UI
    description: string | null;
    isVisible: boolean;
    sortOrder: number;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}
