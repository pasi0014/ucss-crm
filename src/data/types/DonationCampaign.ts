export type DonationCampaign = {
  id?: number;
  stripeProductId?: string;
  nameEn: string;
  nameUa?: string;
  contentEn: string;
  contentUa?: string;
  imageURL?: any;
  startDate: string;
  endDate: string;
  StatusId?: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  DonationCampaignPrices?: any[];
};
