import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const getEvents = async () => {
  const ctx = {
    component: 'components/Events/calls.getEvents',
  };

  let errorMessage = null;

  try {
    console.log('Trying to fetch the Events', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to fetch the Events', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};

export const deleteEvent = async (eventId: number) => {
  const ctx = {
    component: 'components/Events/calls.deleteEvent',
  };

  let errorMessage = null;

  try {
    console.log('Trying to delete the Event', ctx);

    const token = getCookieValue('_auth');

    const response = await axios.delete(`${API_BASE_URL}/v1/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error: any) {
    errorMessage = getAnErrorMessage(error);
    console.error('Unepxected error while trying to delete the Event', { ...ctx, error });
  }

  return {
    success: false,
    data: errorMessage,
  };
};
