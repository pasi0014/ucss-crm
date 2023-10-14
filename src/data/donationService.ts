import axios from 'axios';
import { Client } from './types/Reservation';
import { getCookieValue } from '../utils/utilities';
import API_BASE_URL from '../config';
import { UCSS_API_CONSTANTS } from '../utils/constants';

interface DonationResponse {
  success: boolean;
  data: any;
}

export const getDoantionOverview = async (): Promise<DonationResponse> => {
  const ctx = {
    component: `data/donationService.getDonationOverview`
  };

  let errorMessage = null;

  console.info(`Getting doantions overview`, ctx);
  try {
    const token = getCookieValue('_auth');
    const response = await axios.get(`${API_BASE_URL}/v1/donations/overview`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return {
        success: true,
        data: response.data.content
      };
    }

    errorMessage = response.data.content;
  } catch (error: any) {
    console.error(`Unexpected error while contacting API`, { ...ctx, error });
    errorMessage = error.message;
  }

  return {
    success: false,
    data: errorMessage
  };
};
