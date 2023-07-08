export type Event = {
    id?: number | null,
    name: string,
    description: string,
    startTime: string,
    endTime: string,
    location: string,
    capacity: number,
    StatusId?: number,
    createdAt?: string,
    createdBy?: string,
    updatedBy?: string,
    updatedAt?: string,
}