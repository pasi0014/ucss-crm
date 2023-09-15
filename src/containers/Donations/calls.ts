import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const getDonationCampaigns = async () => {
    const ctx = {
        component: 'containers/Donations/calls.getDonationCampaigns',
    };

    let errorMessage = null;

    try {
        console.log('Trying to get Donation Campaigns ', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.get(
            `${API_BASE_URL}/v1/donations/campaigns`,
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
        console.error('Unexpected error while trying to get Clients', error);
    }

    return {
        success: false,
        data: errorMessage,
    };
};
