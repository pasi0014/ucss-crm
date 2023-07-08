import { Client } from "./Client";

export type Reservation = {
    id?: number;
    EventId: number;
    OwnerId: string;
    Clients?: Client[];
    StatusId?: number;
    createdAt?: Date;
    createdBy?: string | null;
    updatedAt?: Date;
    updatedBy?: string | null;
}