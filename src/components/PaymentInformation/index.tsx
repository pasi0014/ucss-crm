import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Reservation } from '../../types/Reservation';
import { IMessageBar } from '../MessageBar';
import { Price } from '../../types/Price';

interface iPaymentInformationProps {
  reservation: Reservation;
  onReservationUpdate: (reservation: Reservation) => void;
  onNext: () => void;
}

const PaymentInformation: React.FC<iPaymentInformationProps> = ({ reservation, onReservationUpdate, onNext }) => {
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [pendingPayments, setPendindPayments] = useState<Price[]>(reservation.pendingPayments || []);

  const checkTickets = () => {
    const isPaidTicketPresent = reservation.Clients?.find((iClient) => iClient.Price?.ticketType === 'paid');
    if (!isPaidTicketPresent) {
      //   onNext();
      return;
    }
  };

  const calculatePendingPayments = () => {
    const updatedPedningPayments = reservation.Clients?.filter((iClient) => iClient.Price?.ticketType === 'paid').map((iClient) => iClient.Price) as Price[];
    if (updatedPedningPayments.length > 0) {
      console.log({ updatedPedningPayments });
      setPendindPayments(updatedPedningPayments);
      const updatedReservation = { ...reservation, pendingPayments: updatedPedningPayments };
      onReservationUpdate(updatedReservation);
    }
  };

  useEffect(() => {
    checkTickets();
    calculatePendingPayments();
  }, []);

  return <Box>Hello world!</Box>;
};

export default PaymentInformation;
