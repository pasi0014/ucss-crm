import axios from 'axios';
import { createRefresh } from 'react-auth-kit';
import { RefreshTokenCallbackResponse } from 'react-auth-kit/dist/types';
import API_BASE_URL from '../config';

const refreshApi = createRefresh({
  interval: 1, // Refreshs the token in every 10 minutes
  refreshApiCallback: async ({
    // arguments
    authToken,
    refreshToken
  }): Promise<RefreshTokenCallbackResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/refresh`,
        { refresh: refreshToken },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      return {
        isSuccess: true,
        newAuthToken: response.data.accessToken,
        newAuthTokenExpireIn: 180,
        newRefreshTokenExpiresIn: 10080
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
        newAuthToken: authToken || ''
      };
    }
  }
});

export default refreshApi;
