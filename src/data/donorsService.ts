import axios from 'axios';
import API_BASE_URL from '../config';
import { getCookieValue } from '../utils/utilities';
import { UCSS_API_CONSTANTS } from '../utils/constants';

interface DonorsResponse {
  success: boolean;
  data: any;
}

export const fetchTopDonors = async (): Promise<DonorsResponse> => {
  const ctx = {
    component: `data/clientService.saveOrUpdateClient`
  };

  let errorMessage = null;

  console.info(`Getting top donors`, ctx);
  try {
    const token = getCookieValue('_auth');
    const response = await axios.get(`${API_BASE_URL}/v1/donors/top`, {
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

    errorMessage = response.data.errors;
  } catch (error: any) {
    console.error(`Unexpected error while contacting API`, { ...ctx, error });
    errorMessage = error.message;
  }

  return {
    success: false,
    data: errorMessage
  };
};
