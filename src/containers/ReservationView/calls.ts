import axios from "axios";
import API_BASE_URL from "../../config";

import { UCSS_API_CONSTANTS } from "../../utils/constants";
import { getAnErrorMessage, getCookieValue } from "../../utils/utilities";

export async function getReservation(reservationId: any) {
    const ctx = {
        component: `components/EventView.calls.getEventReservation`,
        params: { reservationId }
    }

    let errorMessage = null;

    try {
        console.log('Fetching Reservation', { ...ctx });

        const token = getCookieValue('_auth');

        const response = await axios.get(
            `${API_BASE_URL}/v1/reservations/${reservationId}`,
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
        console.error(`An unexpected error while fetching Reservation`, { ...ctx, error })
    }

    return {
        success: false,
        data: errorMessage,
    }
}
