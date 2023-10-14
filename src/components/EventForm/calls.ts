import axios from 'axios';
import API_BASE_URL from '../../config';

import { Event } from '../../data/types/Event';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const fetchLocationSuggestions = async (location: string) => {
  const ctx = {
    component: `component/EventForm.fetchLocationSuggestions`,
    params: { location }
  };

  let errorMessage = null;

  try {
    console.log('Getting locaiton autosuggestion', { ...ctx });
    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/locations?query=${location}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to get Location suggestions', { ...ctx, error });
  }
  return {
    success: false,
    data: errorMessage
  };
};

export const updateEvent = async (event: Event) => {
  const ctx = {
    component: 'components/EventForm/calls.updateEvent',
    params: { event }
  };

  let errorMessage = null;

  try {
    console.log('Trying to update the Event', { ...ctx });

    const data = event;
    const temp = { event: { ...data } };
    const token = getCookieValue('_auth');

    const response = await axios.put(`${API_BASE_URL}/v1/events/${event.id}`, temp, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to update the Event', { ...ctx, error });
  }
  return {
    success: false,
    data: errorMessage
  };
};

export const findEventById = async (eventId: any) => {
  const ctx = {
    component: 'components/EventDrawer/calls.findEventById',
    params: { eventId }
  };

  let errorMessage = null;

  try {
    console.log('Trying to find Event by id', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to find Event by ID', { ...ctx, error });
  }

  return {
    success: false,
    data: errorMessage
  };
};

export const createEvent = async (event: Event) => {
  const ctx = {
    component: 'components/EventDrawer/calls.createEvent',
    params: { event }
  };

  let errorMessage = null;

  try {
    console.log('Trying to create Event', { ...ctx });

    const data = event;
    const temp = { event: { ...data } };
    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/events`, temp, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to create an Event', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};
