import axios from 'axios';
import { Client } from './types/Reservation';
import { getCookieValue } from '../utils/utilities';
import API_BASE_URL from '../config';
import { UCSS_API_CONSTANTS } from '../utils/constants';

interface ClientResponse {
  success: boolean;
  data: any;
}

export const saveOrUpdateClient = async (client: Client): Promise<ClientResponse> => {
  const ctx = {
    component: `data/clientService.saveOrUpdateClient`,
    params: { client }
  };
  let errorMessage = null;

  console.info(`Saving the client in the DB`, ctx);
  try {
    const token = getCookieValue('_auth');
    const response = await axios.post(
      `${API_BASE_URL}/v1/clients`,
      { client },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

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
