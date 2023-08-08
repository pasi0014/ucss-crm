import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, useColorModeValue, Spacer, Flex } from '@chakra-ui/react';
import { ClientList, PaymentIntent, Reservation } from '../../types/Reservation';
import { IMessageBar } from '../MessageBar';
import { Price } from '../../types/Price';
import PaymentFormWrapper from '../PaymentFormWraper';
import { Button } from '@chakra-ui/react';

interface IPaymentReviewProps {
  reservation: Reservation;
  onReservationUpdate: (reservation: Reservation) => void;
  onNext: () => void;
}

const PaymentReview: React.FC<IPaymentReviewProps> = ({ reservation, onReservationUpdate, onNext }) => {
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [pendingPayments, setPendindPayments] = useState<any[]>([]);

  const bgColor = useColorModeValue('white', 'gray.400');

  const calculatePendingPayments = () => {
    const updatedPedningPayments = reservation.ClientLists?.filter((iClient) => iClient.Price?.ticketType === 'paid').map(
      (iClient) => iClient.Price,
    ) as Price[];
    if (updatedPedningPayments.length > 0) {
      setPendindPayments(updatedPedningPayments);
      const updatedReservation = { ...reservation, pendingPayments: updatedPedningPayments };
      onReservationUpdate(updatedReservation);
    }
  };

  /**
   * Build a summary base on client Tickets
   */
  const buildReservationSummary = () => {
    let totalPrice = reservation.ClientLists?.reduce((acc, iClient) => {
      return acc + (iClient.Price?.amount || 0);
    }, 0);
    return (
      <Box>
        {reservation.ClientLists?.map((iClient) => (
          <div key={iClient.id}>
            <Box mt={4}>
              <Text as="b">{`${iClient.Client.firstName} ${iClient.Client.lastName}`}</Text>
            </Box>
            {/* <span>
              <Text fontSize="sm"> at 23 June</Text>
            </span> */}
            <Box mb={3}>
              <Text fontSize="sm" as="u">
                Ticket: {iClient.Price?.name} - {iClient.Price?.ticketType === 'paid' ? `$CAD ${iClient.Price.amount}` : 'free'}
              </Text>
            </Box>
            <hr />
          </div>
        ))}
        <Box mt={5}>
          <Text fontSize="md">Reservation Total: $CAD ${totalPrice}</Text>
        </Box>
      </Box>
    );
  };

  useEffect(() => {
    calculatePendingPayments();
  }, []);

  return (
    <Box className="w-full" my={10}>
      <div className="flex md:flex-row flex-col-reverse">
        <Box className="w-6/12 p-5 rounded-xl shadow-xl mx-auto" bg={useColorModeValue('gray.50', 'gray.700')}>
          {pendingPayments.length > 0 ? (
            <PaymentFormWrapper
              eventId={reservation.EventId}
              reservationId={reservation.id}
              clientId={reservation.OwnerId}
              pendingPayments={pendingPayments}
              onSuccessPayment={onNext}
            />
          ) : (
            <div className="flex flex-col">
              <span className="text-xl font-bold">This Reservation doesn't require payment</span>
              <span className="text-xl font-medium my-3">You can proceed to the next step</span>
              <Button
                className="p-3 rounded-xl bg-green-500 my-4 w-full font-bold text-white transition-all duration-300s ease hover:bg-green-600"
                onClick={() => console.log('hey')}
              >
                Confirm Reservation
              </Button>
            </div>
          )}
        </Box>
        <Spacer />
        <Box bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="10px" className="w-5/12 h-full" p={3} boxShadow="lg">
          <Heading as="h2" size="md" my={2} p={1}>
            Reservation Summary
          </Heading>
          {/* <hr className={`border-t-1 ${useColorModeValue('border-gray-700', 'border-white')}`} /> */}
          <Flex my={3} borderRadius="10px" p={5} justify-content="start" direction="column" boxShadow="md" bg={useColorModeValue('gray.100', 'gray.600')}>
            {buildReservationSummary()}
          </Flex>
        </Box>
      </div>
    </Box>
  );
};

export default PaymentReview;
