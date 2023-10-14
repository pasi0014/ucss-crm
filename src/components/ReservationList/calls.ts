import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const searchReservations = async (searchTerm: string, statusId: number | null = null) => {
  const ctx = {
    component: 'components/ReservationList/calls.searchReservations'
  };

  let errorMessage = null;

  try {
    console.log('Trying to Search Reservations', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.post(
      `${API_BASE_URL}/v1/reservations/search?searchTerm=${searchTerm}&statusId=${statusId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to search Reservations', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};
