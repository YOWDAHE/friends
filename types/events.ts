export interface EventRecord {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    // NEW
    startDate: string; // ISO
    endDate: string;
    startTime: string;
    endTime: string;
    // OLD: remove once API migrated
    // dateTime: string;
    location: string;
    imageUrl: string | null;
    imagePublicId: string | null;
    isPaidEvent: boolean;
    isPublished: boolean;
    createdAt: string;
}
export interface PublicEventRecord {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    startDate: string; // ISO
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    imageUrl: string | null;
    isPaidEvent: boolean;
    isPublished: boolean;
}
