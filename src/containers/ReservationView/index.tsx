import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heading,
  useColorModeValue,
  Button,
  Box,
  Modal,
  Badge,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { ClientList, Invoice, PaymentIntent, Reservation } from '../../data/types/Reservation';
import { AppContext } from '../../context/AppContext';
import MessageBar, { IMessageBar } from '../../components/MessageBar';
import { checkInGuest, confirmReservation, getReservation } from './calls';

import { ImCancelCircle } from 'react-icons/im';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdEmail, MdPayment } from 'react-icons/md';
import { BsPersonFillAdd } from 'react-icons/bs';

import { getStatus, getStatusColor } from '../../utils/utilities';

import PaymentsTable from '../../components/PaymentsTable';
import GuestCard from '../../components/GuestCard';
import PaymentDrawer from '../../components/PaymentDrawer';
import withStatusFetching from '../../context/withStatus';
import { useToast } from '@chakra-ui/react';
import ReservationDrawer from '../../components/ReservationDrawer';
import { MAXIMUM_CLIENTS } from '../../utils/constants';

const ReservationView: React.FC = (props: any) => {
  const toast = useToast();
  const { reservationId } = useParams<any>();
  const { setAppLoading } = useContext<any>(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [paymentDrawer, setPaymentDrawer] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>();
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  const [enableGuestDelete, setEnableGuestDelete] = useState(true);

  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (reservationId) {
      doFetchReservation();
    }
  }, [reservationId]);

  /**
   * Check if current reservation has any outstanding invoices
   */
  useEffect(() => {
    if (!props.statuses) return;

    if (reservation && reservation.Invoices?.length) {
      if (reservation.StatusId === props.statuses.Reservation.AWAITING_PAYMENT) {
        const tempInvoices = reservation?.Invoices.filter(
          iInvoice => iInvoice.StatusId === props.statuses.Invoice.PENDING
        );
        setPendingInvoices(tempInvoices);
      }
    }

    if (reservation && reservation.ClientLists.length <= 1) {
      setEnableGuestDelete(false);
    }
  }, [reservation, props.statuses]);

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

  const handleConfirmReservation = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await confirmReservation(reservationId);
      if (!response.success) {
        throw new Error(response.data);
      }
      setReservation(response.data);
      toast({
        title: 'Success',
        description: `Reservation has been activated! Confirmation Email has been sent to the customer.`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setShowModal(false);
    setAppLoading(false);
  };

  const doCheckInGuest = async (clientList: ClientList) => {
    setAppLoading(true);
    setMessageBar(null);

    if (!clientList.id) return;
    if (!reservation) return;

    try {
      const response = await checkInGuest(clientList.id);
      if (!response.success) {
        throw new Error(response.data);
      }
      const updatedIndex = reservation.ClientLists.findIndex(item => item.id === clientList.id);
      // Create a copy of the Reservation object
      const updatedReservation = { ...reservation };
      // Update the ClientLists array in the copied Reservation object
      updatedReservation.ClientLists[updatedIndex].StatusId = props.statuses.ClientList.REDEEMED;
      // Update the state with the updated Reservation
      setReservation(updatedReservation);
      toast({
        title: 'Successfully checked in a guest',
        description: `You have checked ${clientList.Client.firstName} in`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    } catch (error: any) {
      console.error(`Error : ${error.message}`, { ...error });
    }
    setAppLoading(false);
  };

  const handlePayment = async (invoiceId: any) => {
    doFetchReservation();
    setPaymentDrawer(false);
    setPendingInvoices(pendingInvoices.filter(iPendingInvoice => iPendingInvoice.id !== invoiceId));
  };

  return (
    <main>
      {/* Confirmation modal popup */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Finish the Reservation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This will create a reservation and send conformation email to the customer
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                handleConfirmReservation();
              }}
            >
              Confirm
            </Button>
            <Button variant="ghost" onClose={() => setShowModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Guest Drawer */}
      <ReservationDrawer
        isOpen={showAddGuest}
        onClose={() => {
          setShowAddGuest(false);
        }}
        eventId={reservation?.EventId}
      />
      {/* Payment Drawer */}
      {reservation && (
        <PaymentDrawer
          isOpen={paymentDrawer}
          onClose={() => setPaymentDrawer(false)}
          eventId={reservation.EventId}
          invoice={pendingInvoices[0]}
          reservationId={reservationId}
          onSuccessPayment={(invoiceId: any) => handlePayment(invoiceId)}
        />
      )}

      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex flex-col w-full">
          <Box
            bg={useColorModeValue('white', 'gray.700')}
            className="my-4 p-5 rounded-lg shadow-md p-3"
          >
            <div className="flex flex-row items-center space-x-4">
              <h1 className="text-2xl font-bold">Reservation Summary</h1>
            </div>
            <div className="flex md:flex-row flex-col justify-between mt-4">
              <div className="flex flex-col">
                {reservation && props.statuses && (
                  <div className="text-sm">
                    <span className="mr-3">Status:</span>
                    <Badge
                      className="rounded-lg"
                      fontSize="0.9em"
                      colorScheme={getStatusColor(
                        getStatus(props.statuses.Reservation, reservation.StatusId).tag || ''
                      )}
                    >
                      {getStatus(props.statuses.Reservation, reservation?.StatusId).tag}
                    </Badge>
                  </div>
                )}
                <div className="text-sm">
                  Created:
                  <span className="ml-2 font-bold">
                    {moment(reservation?.createdAt)
                      .tz('America/Toronto')
                      .format('DD MMM, YYYY [at] HH:mma')}
                  </span>
                </div>
                <div className="text-sm">
                  Created By:
                  <span className="ml-2 font-bold">{reservation?.createdBy}</span>
                </div>
              </div>
              <div className="text-sm md:w-4/12 w-full">
                People on reservation: <b>{reservation?.ClientLists.length}</b>
              </div>
            </div>
            {!!pendingInvoices.length && (
              <div className="my-5">
                <MessageBar
                  type={'warning'}
                  message={
                    <div className="flex flex-row justify-between items-center w-full">
                      This Reservation has outstanding invoice!
                      <Button
                        colorScheme="orange"
                        size="sm"
                        className="ml-2"
                        onClick={() => setPaymentDrawer(true)}
                      >
                        <MdPayment className="mr-2" /> <span>Resolve Payment</span>
                      </Button>
                    </div>
                  }
                />
              </div>
            )}
            <div className="flex sm:flex-row flex-col mt-3">
              {reservation && reservation?.ClientLists.length < MAXIMUM_CLIENTS && (
                <div className="flex flex-row justify-start sm:w-8/12 w-full">
                  <Button
                    className="mt-2 sm:w-6/12 w-full"
                    colorScheme="orange"
                    size={{ base: 'sm' }}
                    onClick={() => setShowAddGuest(true)}
                  >
                    <BsPersonFillAdd className="mr-2" /> Add Guest
                  </Button>
                </div>
              )}

              <div className="flex sm:flex-row flex-col justify-end w-full">
                {reservation &&
                  props.statuses &&
                  reservation.StatusId === props.statuses.Reservation.ACTIVE && (
                    <Button
                      className="mt-2 sm:w-6/12 w-full mr-2"
                      colorScheme="blue"
                      size={{ base: 'sm' }}
                      onClick={() => console.log('send conifrmation email')}
                    >
                      <MdEmail className="mr-2" /> Send Confirmation Email
                    </Button>
                  )}
                {reservation &&
                  props.statuses &&
                  reservation.StatusId !== props.statuses.Reservation.ACTIVE &&
                  reservation.StatusId !== props.statuses.Reservation.AWAITING_PAYMENT && (
                    <Button
                      colorScheme="green"
                      size={{ base: 'sm' }}
                      className="mt-2 sm:w-6/12 w-full mr-2"
                      onClick={() => setShowModal(true)}
                    >
                      <FaCircleCheck className="mr-2" /> Confirm Reservation
                    </Button>
                  )}
                <Button className="mt-2 sm:w-6/12 w-full" colorScheme="red" size={{ base: 'sm' }}>
                  <ImCancelCircle className="mr-2" /> Cancel Reservation
                </Button>
              </div>
            </div>
          </Box>
          <Box
            className="my-4 p-1"
            // bg={useColorModeValue('white', 'gray.700')}
          >
            <Heading as="h2" size="md" my={3}>
              Guests
            </Heading>
            {/* Main Container */}
            <div className="flex flex-col w-full space-y-3">
              {props.statuses &&
                reservation?.ClientLists?.map((iClientList: any) => (
                  <GuestCard
                    key={iClientList.reservationCode}
                    statuses={props.statuses}
                    clientList={iClientList}
                    enableDelete={enableGuestDelete}
                    onCheckIn={doCheckInGuest}
                  />
                ))}
            </div>
          </Box>
        </div>

        <Box
          bg={useColorModeValue('white', 'gray.700')}
          className="lg:mx-5 h-full lg:w-5/12 w-full my-4 p-3 rounded-lg"
        >
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
            <Box
              bg={useColorModeValue('gray.500', 'white')}
              className="inline-block h-[90px] min-h-[1em] w-0.5 self-stretch opacity-100 dark:opacity-50"
            ></Box>
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
              <span className="text-base font-normal tracking-wide">
                {reservation?.Event?.name}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Location</span>
              <span className="text-base font-normal tracking-wide">
                {reservation?.Event?.location}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Event Capacity</span>
              <span className="text-base font-normal tracking-wide">
                {reservation?.Event?.capacity}
              </span>
            </div>
          </div>
        </Box>
      </div>
      {/* Make this block be rendered depedning on condition */}
      {props.statuses && !!reservation?.Invoices?.length && (
        <Box bg={bgColor} className="my-4 p-5 shadow-lg rounded-lg w-full">
          <Heading as="h2" size="md" my={3}>
            Invoices
          </Heading>
          <PaymentsTable statuses={props.statuses} paymentIntents={reservation?.Invoices} />
        </Box>
      )}
    </main>
  );
};

export default withStatusFetching(ReservationView);
