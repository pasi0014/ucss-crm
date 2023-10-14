import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useToast, useColorModeValue } from '@chakra-ui/react';

import { AppContext } from '../../context/AppContext';
import { IMessageBar } from '../MessageBar';
import { PaymentIntent } from '../../data/types/Reservation';

import { createPaymentIntent } from './calls';

import PaymentForm from '../PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

interface IPaymentFormWrapper {
  reservationId: number | unknown;
  eventId: number | undefined;
  clientId: string | undefined;
  pendingPayments: PaymentIntent[];
}

const PaymentFormWrapper = ({
  reservationId,
  eventId,
  clientId,
  pendingPayments,
}: any) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setAppLoading } = useContext<any>(AppContext);
  const [clientSecret, setClientSecret] = useState('');
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const doCreatePaymentIntent = async (isMounted: boolean) => {
    if (!isMounted) return;
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await createPaymentIntent({
        reservationId,
        eventId,
        clientId,
        pendingPayments,
      });
      if (!response.success) {
        toast({
          title: 'Error',
          description: 'There was an error with an API',
          position: 'top-left',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setAppLoading(false);
        return;
      }
      setClientSecret(response.data.clientSecret);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      doCreatePaymentIntent(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const appearance = {
    theme: useColorModeValue('flat', 'night'),
  };
  const options = {
    clientSecret,
    appearance,
  } as any;

  return clientSecret ? (
    <Elements options={options} stripe={stripePromise}>
      <PaymentForm
        onPaymentSuccess={() =>
          navigate(`/events/${eventId}/reservation/${reservationId}`)
        }
        eventId={eventId}
        clientSecret={clientSecret}
        reservationId={reservationId}
      />
    </Elements>
  ) : null;
};

export default PaymentFormWrapper;
