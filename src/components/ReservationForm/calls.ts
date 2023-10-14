import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';
import { Client } from '../../data/types/Client';

export const updateOrSaveClient = async (client: Client) => {
  const ctx = {
    component: 'components/ReservationForm/calls.updateOrSaveClient'
  };

  let errorMessage = null;

  try {
    console.log('Trying to save the Client', { ...ctx });

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
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to save the Client', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};
