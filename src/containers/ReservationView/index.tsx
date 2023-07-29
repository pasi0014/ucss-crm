import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heading, useColorModeValue, Image, Button, Box } from '@chakra-ui/react';
import { ClientList, Event, PaymentIntent, Reservation } from '../../types/Reservation';
import { AppContext } from '../../context/AppContext';
import MessageBar, { IMessageBar } from '../../components/MessageBar';
import { getReservation } from './calls';

import { ImCancelCircle } from 'react-icons/im';
import { FaCircleCheck } from 'react-icons/fa6';

import GuestCard from '../../components/GuestCard';
import moment from 'moment';
import { MdEmail, MdPayment } from 'react-icons/md';
import { Badge } from '@chakra-ui/react';
import { getStatus, getStatusColor } from '../../utils/utilities';
import { StatusContext } from '../../context/StatusContext';
import PaymentsTable from '../../components/PaymentsTable';
import { Modal } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ModalOverlay } from '@chakra-ui/react';
import { ModalContent } from '@chakra-ui/react';
import { ModalHeader } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/react';
import { ModalBody } from '@chakra-ui/react';
import { ModalFooter } from '@chakra-ui/react';

const ReservationView: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { reservationId } = useParams<any>();
  const { setAppLoading } = useContext<any>(AppContext);
  const { statuses } = useContext<any>(StatusContext);
  const [reservation, setReservation] = useState<Reservation | null>();
  const [pendingPayments, setPendingPayments] = useState<PaymentIntent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const doFetchReservation = async () => {
    setAppLoading(false);
    setMessageBar(null);

    try {
      const response = await getReservation(reservationId);
      if (!response.success) {
        throw new Error(response.data);
      }
      setReservation(response.data);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  const handleConfirmReservation = async (reservationId: number) => {
    setLoading(true);
    try {
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (reservationId) {
      doFetchReservation();
    }
  }, [reservationId]);

  useEffect(() => {
    if (reservation && reservation.PaymentIntents?.length && statuses) {
      if (reservation.StatusId === statuses.Reservation.AWAITING_PAYMENT) {
        setPendingPayments(reservation.PaymentIntents);
      }
    }
  }, [reservation]);

  return (
    <main>
      {/* Confirmation modal popup */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Finish the Reservation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>This will create a reservation and send conformation email to the customer</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex flex-col w-full">
          <Box bg={useColorModeValue('white', 'gray.700')} className="my-4 p-5 rounded-lg shadow-md p-3">
            <div className="flex flex-row items-center space-x-4">
              <h1 className="text-2xl font-bold">Reservation Summary</h1>
              {reservation && statuses && (
                <Badge
                  className="my-3 rounded-lg"
                  fontSize="0.9em"
                  colorScheme={getStatusColor(getStatus(statuses.Reservation, reservation.StatusId).tag || '')}
                >
                  {getStatus(statuses.Reservation, reservation?.StatusId).tag}
                </Badge>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm">
                Created:
                <span className="ml-2 font-bold">
                  {moment(reservation?.createdAt)
                    .tz('America/Toronto')
                    .format('DD MMM, YYYY [at] HH:mma')}
                </span>
              </div>
              <div className="text-sm">
                Created By:<span className="ml-2 font-bold">{reservation?.createdBy}</span>
              </div>
            </div>
            {pendingPayments && pendingPayments.length && (
              <div className="my-5">
                <MessageBar
                  type={'warning'}
                  message={
                    <div className="flex flex-row justify-between items-center w-full">
                      This Reservation has outstanding payment!
                      <Button colorScheme="orange" size="sm" className="ml-2">
                        <MdPayment className="mr-2" /> <span>Resolve Payment</span>
                      </Button>
                    </div>
                  }
                />
              </div>
            )}

            <div className="mt-6 mb-4">
              {reservation && statuses && reservation.StatusId === statuses.Reservation.ACTIVE && (
                <Button colorScheme="blue" size="sm" className="mr-2">
                  <MdEmail className="mr-2" /> Send Confirmation Email
                </Button>
              )}

              {reservation &&
                statuses &&
                reservation.StatusId !== statuses.Reservation.ACTIVE &&
                reservation.StatusId !== statuses.Reservation.AWAITING_PAYMENT && (
                  <Button colorScheme="green" size="sm" className="mr-2" onClick={onOpen}>
                    <FaCircleCheck className="mr-2" /> Confirm Reservation
                  </Button>
                )}
              {/* {reservation && statuses && reservation.StatusId === statuses.Reservation.AWAITING_PAYMENT && (
                <Button colorScheme="green" size="sm" className="mr-2">
                  <MdPayment className="mr-2" /> <span>Resolve Reservation Balance</span>
                </Button>
              )} */}
              <Button colorScheme="red" size="sm">
                <ImCancelCircle className="mr-2" /> Cancel Reservation
              </Button>
            </div>
          </Box>
          <Box className="shadow-lg my-4 p-5 rounded-lg" bg={useColorModeValue('white', 'gray.700')}>
            <Heading as="h2" size="md" my={3}>
              Guests
            </Heading>
            {/* Main Container */}
            <div className="flex flex-col w-full space-y-3">
              {reservation?.ClientLists?.map((iClientList: any) => <GuestCard key={iClientList.reservationCode} clientList={iClientList} />)}
            </div>
          </Box>
        </div>

        <Box bg={useColorModeValue('white', 'gray.700')} className="lg:mx-5 h-full lg:w-7/12 w-full my-4 p-3 rounded-lg">
          <div className="p-3">
            <Heading as="h2" size="md">
              Event Information
            </Heading>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Start Time</span>
              <span className="text-base font-medium tracking-wide">
                {moment(reservation?.Event?.startTime)
                  .tz('America/Toronto')
                  .utc()
                  .format('DD MMM, YYYY [at] HH:mma')}
              </span>
            </div>
            <Box bg={useColorModeValue('gray.500', 'white')} className="inline-block h-[90px] min-h-[1em] w-0.5 self-stretch opacity-100 dark:opacity-50"></Box>
            <div className="text-left w-full ml-10 flex flex-col">
              <span className="font-bold text-sm tracking-wide leading-relaxed">End Time</span>
              <span className="text-base font-medium tracking-wide">
                {' '}
                {moment(reservation?.Event?.endTime)
                  .tz('America/Toronto')
                  .utc()
                  .format('DD MMM, YYYY [at] HH:mma')}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Name</span>
              <span className="text-base font-normal tracking-wide">{reservation?.Event?.name}</span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Location</span>
              <span className="text-base font-normal tracking-wide">{reservation?.Event?.location}</span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Event Capacity</span>
              <span className="text-base font-normal tracking-wide">{reservation?.Event?.capacity}</span>
            </div>
          </div>
        </Box>
      </div>
      {/* Make this block be rendered depedning on condition */}
      {!!reservation?.PaymentIntents?.length && (
        <Box bg={useColorModeValue('white', 'gray.700')} className="my-4 p-5 shadow-lg rounded-lg w-full">
          <Heading as="h2" size="md" my={3}>
            Payments
          </Heading>
          <PaymentsTable paymentIntents={reservation?.PaymentIntents} />
        </Box>
      )}
    </main>
  );
};

export default ReservationView;
