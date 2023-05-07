import axios from 'axios';
import API_BASE_URL from '../../config';

import { Event, Price } from '../../types';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const findEventPrice = async (eventId: any) => {
  const ctx = {
    components: 'components/EventDrawer/calls.findEventPrice',
    params: { eventId },
  };

  let errorMessage = null;

  try {
    console.log('Trying to find Event Price by id', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/prices/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      console.log("Successfuly found the Event Price ", ctx);
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to find Event Price', { ...ctx, error });
  }

  return {
    success: false,
    data: errorMessage,
  };
};

export const findEventById = async (eventId: any) => {
  const ctx = {
    component: 'components/EventDrawer/calls.findEventById',
    params: { eventId },
  };

  let errorMessage = null;

  try {
    console.log('Trying to find Event by id', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    data: errorMessage,
  };
};

export const createEvent = async (event: Event) => {
  const ctx = {
    component: 'components/EventDrawer/calls.createEvent',
    params: { event },
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
        Authorization: `Bearer ${token}`,
      },
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
    data: errorMessage,
  };
};

export const updateEvent = async (event: Event) => {
  const ctx = {
    component: 'components/EventDrawer/calls.updateEvent',
    params: { event },
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
        Authorization: `Bearer ${token}`,
      },
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
    data: errorMessage,
  };
};

export const createPrice = async (price: Price) => {
  const ctx = {
    component: 'components/EventDrawer/calls.createPrice',
    params: { price },
  };

  let errorMessage = null;

  try {
    console.log('Trying to create a Price', { ...ctx });

    const data = price;
    const temp = { price: { ...data } };
    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/prices`, temp, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to create a Price', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};

export const updateEventStatus = async (statusId: number) => {
  const ctx = {
    component: 'components/EventDrawer/calls.createPrice',
  };

  let errorMessage = null;

  try {
    console.log('Trying to update the Event status', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/events/status/${statusId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to update status of an Event', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};
