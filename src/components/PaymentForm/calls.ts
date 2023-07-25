import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';

export const applyPayment = async (paymentIntent: any, reservationId: number | unknown, eventId: number) => {
    const ctx = {
        component: `components/PaymentForm/calls.applyPayment`,
        params: { paymentIntent, reservationId, eventId },
    };

    let errorMessage = null;

    try {
        console.log('Processing Payment', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.post(
            `${API_BASE_URL}/v1/payments/reservation/${reservationId}`,
            { paymentIntent },
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
        console.error('Unexpected error while trying to process Payment', error);
    }

    return {
        success: false,
        data: errorMessage,
    };
}
