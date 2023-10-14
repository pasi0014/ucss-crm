import React, { useContext, useEffect, useState } from 'react';
import {
  Invoice,
  InvoiceItem,
  PaymentIntent,
} from '../../data/types/Reservation';
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useColorModeValue,
} from '@chakra-ui/react';

import { findOrCreatePaymentIntent } from './calls';

import { AppContext } from '../../context/AppContext';
import { IMessageBar } from '../MessageBar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useToast } from '@chakra-ui/react';
import PaymentForm from '../PaymentForm';
import { Price } from '../../data/types/Price';
import { useNavigate } from 'react-router-dom';
import { calculateFees } from '../../utils/utilities';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

interface IPaymentDrawer {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice;
  reservationId: any;
  eventId: any;
  onSuccessPayment: (invoiceId: number | undefined) => void;
}

/**
 * PaymentDrawer is used in the Reservation View
 * It's purpose to pay a single Invoice
 */
const PaymentDrawer: React.FC<IPaymentDrawer> = ({
  isOpen,
  onClose,
  invoice,
  eventId,
  reservationId,
  onSuccessPayment,
}) => {
  const bgColor = useColorModeValue('gray.200', 'gray.800');
  const navigate = useNavigate();
  const toast = useToast();
  const { setAppLoading } = useContext<any>(AppContext);
  const [clientSecret, setClientSecret] = useState('');
  const [fees, setFees] = useState<number>(0);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const getClientSecret = async (isMounted: boolean) => {
    if (!isMounted) return;
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await findOrCreatePaymentIntent({
        reservationId,
        invoiceItems,
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
    if (invoice) {
      setInvoiceItems(invoice.InvoiceItems as InvoiceItem[]);
      const { totalFees } = calculateFees(invoice.totalAmount);
      setFees(totalFees);
    }
  }, [invoice]);

  useEffect(() => {
    let isMounted = true;

    if (!!invoiceItems.length && isOpen && isMounted) {
      getClientSecret(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [invoiceItems, isOpen]);

  const appearance = {
    theme: useColorModeValue('flat', 'night'),
  };
  const options = {
    clientSecret,
    appearance,
  } as any;

  // Helper function to group items by Price ID and calculate counts
  function renderGroupedItems(items: InvoiceItem[]) {
    const groupedItems: { [key: number]: { count: number; price: Price } } = {};

    items.forEach((item) => {
      const priceId = item.PriceId;

      if (groupedItems[priceId]) {
        groupedItems[priceId].count++;
      } else {
        groupedItems[priceId] = {
          count: 1,
          price: item.Price,
        };
      }
    });

    return Object.values(groupedItems).map((groupedItem) => (
      <Box key={groupedItem.price.id}>
        {groupedItem.count > 1 ? (
          <div>{`${groupedItem.count} x ${groupedItem.price.name} | $CAD ${groupedItem.price.amount}`}</div>
        ) : (
          <div>{`1 x ${groupedItem.price.name} | $CAD ${groupedItem.price.amount}`}</div>
        )}
      </Box>
    ));
  }
  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerHeader>Payments</DrawerHeader>
        <DrawerBody>
          {invoice && !!invoiceItems.length && (
            <Box p={5} boxShadow="md" bg={bgColor} borderRadius="15px" mb={5}>
              <h2 className="text-xl font-bold mb-2">Order Details</h2>
              <Box className="font-bold text-lg mb-2">
                {invoice?.Client.firstName} {invoice?.Client.lastName}
              </Box>
              {renderGroupedItems(invoiceItems)}
              <Box className="font-medium text-base my-2">
                Payment Processing Fees: <b>$CAD{fees}</b>
              </Box>
              <Box className="font-medium text-base mt-3">
                Total: $CAD<b>{parseInt(invoice.totalAmount, 10) + fees}</b>
              </Box>
            </Box>
          )}

          <Box bg={bgColor} p={5} borderRadius="15px" boxShadow="md">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <PaymentForm
                  onPaymentSuccess={() => onSuccessPayment(invoice?.id)}
                  eventId={eventId}
                  clientSecret={clientSecret}
                  reservationId={reservationId}
                />
              </Elements>
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PaymentDrawer;
