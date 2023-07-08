export type Reservation = {
    id?: number;
    reservationCode?: string | null;
    EventId: number;
    OwnerId: string;
    ClientList?: Array<any>;
    StatusId?: number;
    createdAt?: Date;
    createdBy?: string | null;
    updatedAt?: Date;
    updatedBy?: string | null;
}