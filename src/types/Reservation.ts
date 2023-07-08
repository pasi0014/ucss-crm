import { Client } from "./Client";
import { Price } from "./Price";

export type Reservation = {
    id?: number;
    EventId: number;
    OwnerId: string;
    Clients?: Client[];
    pendingPayments?: Price[],
    StatusId?: number;
    createdAt?: Date;
    createdBy?: string | null;
    updatedAt?: Date;
    updatedBy?: string | null;
}