import axios from 'axios';
import { getAnErrorMessage } from '../../utils/utilities';
import { Donor } from '../../data/types/Donor';
import API_BASE_URL from '../../config';

export const createDonor = async (donor: Donor) => {
  const ctx = {
    component: 'components/DonorForm/calls.createDonor',
    params: { donor }
  };

  let errorMessage = null;

  try {
    console.log('Trying to create Donor', { ...ctx });

    const data = donor;
    const token = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/v1/donors`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id !== 9999) {
      return { success: true, data: response.data };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to create a Donor', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};
