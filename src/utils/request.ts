// import { authContext } from "./permissions";
import { UCSS_API_CONSTANTS } from "./constants";

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {Promise<any>} A promise that resolves with the response data
 */
export default async function request(
  url: RequestInfo,
  options?: any,
  auth?: Boolean
): Promise<any> {
  // Get the authentication token and session ID from the storage
  const token = localStorage.getItem("authToken");
  const sessionId = sessionStorage.sessionId;

  let headers = {};
  if (auth) {
    // Set the default headers for the request
    headers = new Headers({
      Authorization: `Bearer ${token}`,
      "Winston-Session": sessionId,
      ...options.headers,
    });
  }

  // Make the request with the specified options
  const response = await fetch(url, { ...options, headers });

  // Check the response status and parse the data if successful
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(
      `Request failed with status ${response.status}: ${response.statusText}`
    );
  }
}

interface QuickRequestOptions {
  url: string;
  options?: RequestInit;
  onSuccss?: (response: any) => any;
  onError?: ((errorMessage: string) => any) | null;
}

export async function quickRequest({
  url,
  options = {},
  onSuccss,
  onError = null,
}: QuickRequestOptions) {
  try {
    const response = await request(url, options);

    if (response.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      if (onSuccss) {
        return onSuccss(response);
      }

      return {
        success: true,
        data: response.content,
      };
    }

    throw new Error(getAnErrorMessage(response));
  } catch (error) {
    const errorMessage = getAnErrorMessage(error);

    if (onError) {
      return onError(errorMessage);
    }

    return {
      success: false,
      data: errorMessage,
    };
  }
}

function getAnErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  } else {
    return "An unknown error occurred.";
  }
}
