import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, useColorModeValue, Spacer, Flex } from '@chakra-ui/react';
import { Reservation } from '../../types/Reservation';
import { IMessageBar } from '../MessageBar';
import { Price } from '../../types/Price';

interface IPaymentReviewProps {
  reservation: Reservation;
  onReservationUpdate: (reservation: Reservation) => void;
  onNext: () => void;
}

const PaymentReview: React.FC<IPaymentReviewProps> = ({ reservation, onReservationUpdate, onNext }) => {
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [pendingPayments, setPendindPayments] = useState<Price[]>(reservation.pendingPayments || []);

  const checkTickets = () => {
    const isPaidTicketPresent = reservation.ClientLists?.find((iClient) => iClient.Price?.ticketType === 'paid');
    if (!isPaidTicketPresent) {
      //   onNext();
      return;
    }
  };

  const calculatePendingPayments = () => {
    const updatedPedningPayments = reservation.ClientLists?.filter((iClient) => iClient.Price?.ticketType === 'paid').map(
      (iClient) => iClient.Price,
    ) as Price[];
    if (updatedPedningPayments.length > 0) {
      console.log({ updatedPedningPayments });
      setPendindPayments(updatedPedningPayments);
      const updatedReservation = { ...reservation, pendingPayments: updatedPedningPayments };
      onReservationUpdate(updatedReservation);
    }
  };

  useEffect(() => {
    calculatePendingPayments();
  }, []);

  return (
    <Box className="w-full" my={10}>
      <div className="flex md:flex-row flex-col-reverse">
        <Box>Payment Info Here</Box>
        <Spacer />
        <Box bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="10px" width={{ base: '100%', md: '400px' }} p={3} boxShadow="lg">
          <Heading as="h2" size="md" my={2} p={1}>
            Reservation Summary
          </Heading>
          {/* <hr className={`border-t-1 ${useColorModeValue('border-gray-700', 'border-white')}`} /> */}
          <Flex my={3} borderRadius="10px" p={5} justify-content="start" direction="column" boxShadow="md" bg={useColorModeValue('gray.50', 'gray.600')}>
            <Box>
              <Text as="b">Nazar Pasika</Text>
            </Box>
            <span>
              <Text fontSize="sm"> Testing Event at 23 June</Text>
            </span>
            <Box mb={3}>
              <Text fontSize="sm" as="u">
                Ticket: General Admission - free
              </Text>
            </Box>
            <hr />
            <Box mt={5}>
              <Text fontSize="md">Reservation Total: $0</Text>
            </Box>
          </Flex>
        </Box>
      </div>
    </Box>
  );
};

export default PaymentReview;
