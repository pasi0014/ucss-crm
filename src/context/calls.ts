import API_BASE_URL from '../config';
import { UCSS_API_CONSTANTS } from '../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../utils/utilities';

import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
  const ctx = {
    component: 'context/call.loginUser',
    params: { email, password }
  };

  let errorMessage = null;

  try {
    console.log('Trying to login User', { ...ctx });
    const data = { email, password };

    const response = await axios.post(`${API_BASE_URL}/login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while loggin in', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};

export const valdiateToken = async () => {
  const ctx = {
    component: 'context/calls.validateToken'
  };

  let errorMessage = null;

  try {
    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/security`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error: any) {
    console.error('Could not verify the token', { ...error });
  }

  return {
    success: false,
    data: errorMessage
  };
};

export const getStatuses = async () => {
  const ctx = {
    component: `context/calls.getStatuses`
  };

  let errorMessage = null;
  let resStatus = null;

  try {
    console.log('Fetching Statuses', ctx);

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error: any) {
    console.error('Unexpected error while trying to fetch Statuses', { ...error });
    resStatus = error.response.status;
  }

  return {
    success: false,
    data: errorMessage,
    resStatus
  };
};
