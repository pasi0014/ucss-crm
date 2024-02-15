import axios from 'axios';
import API_BASE_URL from '../../config';

import { DonationCampaign } from '../../data/types/DonationCampaign';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const getDonationCampaignById = async (campaignId: number | undefined) => {
  const ctx = {
    component: 'components/DonationCampaignDrawer/calls.getDonationCampaignById',
    params: { campaignId }
  };

  let errorMessage = null;

  try {
    console.log('Trying to find Donation Campaign by id', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/donations/campaigns/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to find Donation Campaign by ID', {
      ...ctx,
      error
    });
  }

  return {
    success: false,
    data: errorMessage
  };
};

export const saveDonationCampaign = async (donationCampaign: DonationCampaign) => {
  const ctx = {
    component: 'components/EventDrawer/calls.createDonationCampaign',
    params: { donationCampaign }
  };

  let errorMessage = null;

  try {
    console.log('Trying to Create Donation Campaign', { ...ctx });

    const data = donationCampaign;
    const temp = { donationCampaign: { ...data } };
    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/donations/campaigns`, temp, {
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
    console.error('Unexpected error while trying to create a Donation Campaign', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};
