import axios from 'axios';
import API_BASE_URL from '../../config';

import { Price } from '../../types/Price';

import { UCSS_API_CONSTANTS } from '../../utils/constants';
import { getAnErrorMessage, getCookieValue } from '../../utils/utilities';


export const deletePrice = async (priceId: number | unknown) => {
  const ctx = {
    component: 'components/EventDrawer/calls.deletePrice',
    params: { priceId }
  }

  let errorMessage = null;

  try {
    console.log("Trying to delte the Event Price");

    const token = getCookieValue('_auth');
    const response = await axios.delete(`${API_BASE_URL}/v1/prices/${priceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      console.log("Successfuly deleted Price ", ctx);
      return { success: true, data: response.data.content };
    }
    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unepxected error while deleting Event Price ', { ...ctx, error })
  }

  return {
    success: false,
    data: errorMessage,
  };
}

export const updatePrice = async (price: any) => {
  const ctx = {
    component: 'components/EventDrawer/calls.updateEventPrice',
    params: { price }
  }

  let errorMessage = null;

  try {
    console.log("Trying to update Event Price", ctx);
    const data = price;
    const temp = { price: { ...data } };
    const token = getCookieValue("_auth");

    const response = await axios.put(`${API_BASE_URL}/v1/prices/${price.id}`, { ...temp }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      console.log("Successfuly updated Price ", ctx);
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);

  } catch (error: any) {
    console.error('Unepxected error while updating Event Price ', { ...ctx, error })
  }

  return {
    success: false,
    data: errorMessage,
  }
}


export const findEventPrice = async (eventId: any) => {
  const ctx = {
    components: 'components/EventDrawer/calls.findEventPrice',
    params: { eventId },
  };

  let errorMessage = null;

  try {
    console.log('Trying to find Event Price by id', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.get(`${API_BASE_URL}/v1/prices/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      console.log("Successfuly found the Event Price ", ctx);
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to find Event Price', { ...ctx, error });
  }

  return {
    success: false,
    data: errorMessage,
  };
};

export const createPrice = async (price: Price) => {
  const ctx = {
    component: 'components/EventDrawer/calls.createPrice',
    params: { price },
  };

  let errorMessage = null;
  console.log({ price })
  try {
    console.log('Trying to create a Price', { ...ctx });

    const data = price;
    const temp = { price: { ...data } };
    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/prices`, temp, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to create a Price', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};

// export const getEventStatus = async (eventId: number | null | undefined) => {
//   const ctx = {
//     component: `components/EventDrawer/calls.getEventStatus`,
//     params: { eventId }
//   };

//   let errorMessage = null;

//   try {
//     console.log('Trying to get the Event status', { ...ctx });

//     const token = getCookieValue('_auth');

//     const response = await axios.get(`${API_BASE_URL}/v1/events/${eventId}/status/`, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//       },
//     });

//     if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
//       return { success: true, data: response.data.content };
//     }

//     errorMessage = getAnErrorMessage(response);
//   } catch (error) {
//     console.error('Unexpected error while trying to update status of an Event', error);
//   }

//   return {
//     success: false,
//     data: errorMessage,
//   };

// }

export const updateEventStatus = async (statusId: number, eventId: null | undefined | number) => {
  const ctx = {
    component: 'components/EventDrawer/calls.updateEventStatus',
  };

  let errorMessage = null;

  try {
    console.log('Trying to update the Event status', { ...ctx });

    const token = getCookieValue('_auth');

    const response = await axios.post(`${API_BASE_URL}/v1/events/${eventId}/status/${statusId}`, {}, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.code.id === UCSS_API_CONSTANTS.SUCCESS_CODE) {
      return { success: true, data: response.data.content };
    }

    errorMessage = getAnErrorMessage(response);
  } catch (error) {
    console.error('Unexpected error while trying to update status of an Event', error);
  }

  return {
    success: false,
    data: errorMessage,
  };
};
