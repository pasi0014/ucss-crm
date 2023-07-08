import { Price } from "./Price";

export type Client = {
    id?: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    locale?: string,
    isOwner?: boolean,
    Price?: Price,
}
