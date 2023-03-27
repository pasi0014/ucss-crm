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
    const url = "http://localhost:3005/login";

    console.log("Trying to login User", { ...ctx, url });
    const data = { email, password };

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
