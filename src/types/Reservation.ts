// import { Client } from "./Client";
import { Price } from "./Price";

export type Reservation = {
    id?: number;
    reservationCode?: string;
    EventId?: number;
    OwnerId?: string;
    StatusId?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    ClientLists: ClientList[];
    Invoices?: Invoice[];
    Event?: Event;
    PaymentIntents?: PaymentIntent[];
}



export type ClientList = {
    id?: number;
    reservationCode?: string;
    isOwner?: boolean;
    ClientId?: string;
    ReservationId?: number;
    PriceId?: number;
    StatusId?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    Client: Client;
    Price?: Price;
}

export type Client = {
    id: string;
    firstName: string;
    lastName: string;
    locale?: string;
    phone: string;
    email: string;
    StatusId?: number;
    isOwner?: boolean;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export type Price2 = {
    id: number;
    EventId: number;
    name: string;
    amount: number;
    ticketType: string;
    StatusId: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export type Event = {
    id: number;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location: string;
    capacity: number;
    StatusId: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export type PaymentIntent = {
    id: number;
    stripeResponse: string;
    stripePI_id: string;
    client_secret: string;
    amount: number;
    currency: string;
    ReservationId: number;
    StatusId: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    Invoices: Invoice[];
}

export type Invoice = {
    id: number;
    ClientId: string;
    Client: Client;
    EventId: number;
    InvoiceItems?: [],
    PaymentIntentId: number;
    payment_intent_id: string;
    totalAmount: string;
    StatusId: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}


export interface InvoiceItem {
    id: number;
    InvoiceId: number;
    Client: Client;
    ClientId: string;
    PriceId: number;
    StatusId: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    Price: Price;
}
