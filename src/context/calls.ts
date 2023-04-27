import API_BASE_URL from "../config";
import { UCSS_API_CONSTANTS } from "../utils/constants";
import request, { quickRequest } from "../utils/request";
import { getAnErrorMessage } from "../utils/utilities";

import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const ctx = {
    component: "context/call.loginUser",
    params: { email, password },
  };

  let errorMessage = null;

  try {

    console.log("Trying to login User", { ...ctx });
    const data = { email, password };

    const response = await axios.post(`${API_BASE_URL}/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log({ response })
    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error("Unexpected error while loggin in", error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};

export const getStatuses = async () => {
  const ctx = {
    component: `context/calls.getStatuses`,
  }

  let errorMessage = null;

  try {
    console.log('Fetching Statuses', ctx);

    const token = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/v1/status`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error: any) {
    console.error("Unexpected error while trying to fetch Statuses");
  }

  return {
    success: false,
    data: errorMessage
  }
};

