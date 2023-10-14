import { Price } from './Price';

export type Event = {
  id?: number | null;
  name: string;
  imageURL?: any;
  description: string;
  startTime: string;
  endTime: string;
  saleStart?: string;
  saleEnd?: string;
  location: string;
  coordinates?: object;
  capacity: number;
  StatusId?: number;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
  Prices?: Price[];
};
