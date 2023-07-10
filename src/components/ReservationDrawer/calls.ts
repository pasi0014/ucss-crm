import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';
import { Client } from '../../types/Client';
import { Reservation } from '../../types/Reservation';

export const saveClientsToDB = async (clients: any) => {
  const ctx = {
    component: 'components/ReservationDrawer/calls.saveClientsToDB',
    params: { clients },
  };

  let errorMessage = null;

  try {
    console.log('Trying to save Clients', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.post(
      `${API_BASE_URL}/v1/clients/bulk`,
      { clients },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to save Clients', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};

export async function postLightReservation(reservation: Reservation) {
  const ctx = {
    component: `components/ReservationDrawer.calls.postLightReservation`,
    params: { reservation },
  };

  let errorMessage = null;

  try {
    console.log('Trying to post Reservation', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.post(
      `${API_BASE_URL}/v1/reservations/light`,
      { reservation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to create a Reservation', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
}