import axios from "axios";
import { getAnErrorMessage, getCookieValue } from "../../utils/utilities";
import API_BASE_URL from "../../config";
import { UCSS_API_CONSTANTS } from "../../utils/constants";


export const updateCampaignStatus = async (statusId: any, donationCampaignId?: number) => {
    const ctx = {
        component: 'components/EventDrawer/calls.updateEventStatus'
    };

    let errorMessage = null;

    try {
        console.log('Trying to update the Event status', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.post(
            `${API_BASE_URL}/v1/donations/campaigns/${donationCampaignId}/status`,
            { statusId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
            return { success: true, data: response.data.content };
        }

        errorMessage = getAnErrorMessage(response);
    } catch (error) {
        console.error('Unexpected error while trying to update status of an Event', error);
    }

    return {
        success: false,
        data: errorMessage
    };
};
