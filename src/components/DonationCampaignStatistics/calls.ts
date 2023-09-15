import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const getDonationCampaignStatistics = async () => {
    const ctx = {
        component: 'components/DonationCampaignStatistics/calls.getDonationCampaignStatistics',
    };

    let errorMessage = null;

    try {
        console.log('Trying to get Donation Campaign statistics ', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.get(
            `${API_BASE_URL}/v1/clients`,
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

export const getCampaignDonors = async (campaignId: number | undefined) => {
    const ctx = {
        component: 'components/DonationCampaignStatistics/calls.getCampaignDonors',
    };

    let errorMessage = null;

    try {
        console.log('Trying to get Donation Campaign Donors ', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.get(
            `${API_BASE_URL}/v1/donations/campaigns/${campaignId}/donors`,
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
        console.error('Unexpected error while trying to get Donation Campaign Donors', error);
    }

    return {
        success: false,
        data: errorMessage,
    };
};
