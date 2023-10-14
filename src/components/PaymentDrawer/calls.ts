import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';
import { InvoiceItem } from '../../data/types/Reservation';

export const findOrCreatePaymentIntent = async ({
  invoiceItems,
  reservationId
}: {
  invoiceItems: InvoiceItem[];
  reservationId: number;
}) => {
  const ctx = {
    component: `components/PaymentDrawer/calls.findOrCreatePaymentIntent`,
    params: { invoiceItems, reservationId }
  };

  let errorMessage = null;

  try {
    console.log('Creating payment intent', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.post(
      `${API_BASE_URL}/v1/payments/intent`,
      { invoiceItems, reservationId },
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
    console.error('Unexpected error while trying to create a PaymentIntent', error);
  }

  return {
    success: false,
    data: errorMessage
  };
};
