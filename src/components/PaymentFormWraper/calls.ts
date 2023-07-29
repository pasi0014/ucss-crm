import axios from 'axios';
import API_BASE_URL from '../../config';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';
import { Price } from '../../types/Price';

export const createPaymentIntent = async ({
    pendingPayments,
    reservationId,
    clientId,
    eventId }:
    { pendingPayments: Price[], reservationId: number | unknown, clientId: string | undefined, eventId: number }) => {
    const ctx = {
        component: `components/PaymentFormWrapper/calls.createPaymentIntent`,
        params: { pendingPayments, reservationId, clientId, eventId },
    };

    let errorMessage = null;

    try {
        console.log('Creating payment intent', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.post(
            `${API_BASE_URL}/v1/payments/intent/reservation/${reservationId}`,
            { pendingPayments, clientId, eventId },
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
        console.error('Unexpected error while trying to create a PaymentIntent', error);
    }

    return {
        success: false,
        data: errorMessage,
    };
}

export const processPayment = async (reservationId: number, eventId: number, clientId?: string) => { }
