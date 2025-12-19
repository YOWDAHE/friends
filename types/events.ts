export interface EventRecord {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    dateTime: string;
    location: string;
    imageUrl: string | null;
    imagePublicId: string | null;
    isPaidEvent: boolean;
    isPublished: boolean;
    createdAt: string;
}
