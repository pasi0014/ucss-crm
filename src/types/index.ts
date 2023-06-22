export type Donor = {
  id?: number;
  name: string;
  best_contact: string;
  lastDonation: string;
  location: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  StatusId?: number;
};


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

export type Price = {
  id?: number,
  EventId: number | null,
  ticketType: string,
  amount: number,
  name: string,
  StatusId?: number,
  createdAt?: string,
  createdBy?: string,
  updatedAt?: string,
  updatedBy?: string,
}

