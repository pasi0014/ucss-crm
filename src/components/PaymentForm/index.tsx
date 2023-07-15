import React, { useContext, useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Layout } from '@stripe/stripe-js';
import { Spinner } from '@chakra-ui/react';
import MessageBar, { IMessageBar } from '../MessageBar';
import { Button } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { AppContext } from '../../context/AppContext';
import { applyPayment } from './calls';

interface IPaymentForm {
  eventId: number;
  clientSecret: string;
  reservationId: number | unknown;
  onNext: () => void;
}

const PaymentForm: React.FC<IPaymentForm> = ({ eventId, reservationId, clientSecret, onNext }) => {
  const stripe = useStripe();
  const elements = useElements();

  const { setAppLoading } = useContext<any>(AppContext);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [isLoading, setIsLoading] = useState<any>(false);

  // TODO: finish this method - NP
  const doProcessPayment = async () => {
    setAppLoading(true);
    setMessageBar(null);
    try {
      const stripeResponse = await stripe?.retrievePaymentIntent(clientSecret);
      const response = await applyPayment(stripeResponse, reservationId, eventId);

      if (!response.success) {
        throw new Error('There was an error while saving payment. Please try opening the reservation again');
      }
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessageBar({ type: 'success', message: 'Payment succeeded!' });
          break;
        case 'processing':
          setMessageBar({ type: 'info', message: 'Your payment is processing.' });
          break;
        case 'requires_payment_method':
          setMessageBar(null);
          break;
        default:
          setMessageBar({ type: 'error', message: 'Something went wrong.' });
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (!error) {
    }
    console.log('SuccessPayment', { error, elements: elements.getElement(PaymentElement) });
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      setMessageBar({ type: 'error', message: error.message });
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as Layout,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Show any error or success messages */}
      {messageBar && <MessageBar type={messageBar.type} message={messageBar.message} />}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        className="p-3 rounded-xl bg-green-500 my-4 w-full font-bold text-white transition-all duration-300s ease hover:bg-green-600"
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        <span id="button-text">{isLoading ? <Spinner /> : <>Pay Now</>}</span>
      </button>
    </form>
  );
};

export default PaymentForm;
