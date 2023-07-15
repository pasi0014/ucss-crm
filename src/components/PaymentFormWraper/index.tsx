import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useToast } from '@chakra-ui/react';

import { AppContext } from '../../context/AppContext';
import { IMessageBar } from '../MessageBar';

import { createPaymentIntent } from './calls';

import PaymentForm from '../PaymentForm';
import { Price } from '../../types/Price';
import { useColorModeValue } from '@chakra-ui/react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

interface IPaymentFormWrapper {
  reservationId: number | unknown;
  eventId: number;
  clientId: string;
  pendingPayments: Price[];
  onNext: () => void;
}

const PaymentFormWrapper: React.FC<IPaymentFormWrapper> = ({ reservationId, eventId, clientId, pendingPayments, onNext }) => {
  const { setAppLoading } = useContext<any>(AppContext);
  const toast = useToast();
  const [clientSecret, setClientSecret] = useState('');
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const doCreatePaymentIntent = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await createPaymentIntent({ reservationId, eventId, clientId, pendingPayments });
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
    doCreatePaymentIntent();
  }, []);

  const appearance = {
    theme: useColorModeValue('flat', 'night'),
  };
  const options = {
    clientSecret,
    appearance,
  } as any;

  return (
    clientSecret && (
      <Elements options={options} stripe={stripePromise}>
        <PaymentForm eventId={eventId} clientSecret={clientSecret} reservationId={reservationId} onNext={onNext} />
      </Elements>
    )
  );
};

export default PaymentFormWrapper;
