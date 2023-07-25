import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heading, useColorModeValue, Image, Button, Box } from '@chakra-ui/react';
import { ClientList, Event, PaymentIntent } from '../../types/Reservation';
import { AppContext } from '../../context/AppContext';
import { IMessageBar } from '../../components/MessageBar';
import { getReservation } from './calls';

import { ImCancelCircle } from 'react-icons/im';

import GuestCard from '../../components/GuestCard';
import moment from 'moment';
import { MdEmail } from 'react-icons/md';

interface Reservation {
  id: number;
  reservationCode: string;
  EventId: number;
  OwnerId: string;
  StatusId: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  ClientLists: ClientList[];
  Event: Event;
  PaymentIntents: PaymentIntent[];
}

const ReservationView: React.FC = () => {
  const { reservationId } = useParams<any>();
  const { setAppLoading } = useContext<any>(AppContext);
  const [reservation, setReservation] = useState<Reservation | null>(null);
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

  useEffect(() => {
    if (reservationId) {
      doFetchReservation();
    }
  }, [reservationId]);

  return (
    <main>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex flex-col w-full">
          <Box bg={useColorModeValue('white', 'gray.700')} className="my-4 p-3 rounded-lg shadow-md p-3">
            <h1 className="text-2xl font-bold">Reservation Summary</h1>
            <div className="mt-3">
              <Button colorScheme="blue" size="sm" className="mr-2">
                <MdEmail className="mr-2" /> Send Confirmation Email
              </Button>
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

        <Box bg={useColorModeValue('white', 'gray.700')} className="lg:mx-5 h-full my-4 w-7/12 p-3 rounded-lg">
          <div className="p-3">
            <Heading as="h2" size="md">
              Event Information
            </Heading>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Start Time</span>
              <span className="text-base font-medium tracking-wide">
                {moment(reservation?.Event.startTime)
                  .tz('America/Toronto')
                  .utc()
                  .format('DD MMM, YYYY [at] HH:mma')}
              </span>
            </div>
            <div className="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>
            <div className="text-left w-full ml-10 flex flex-col">
              <span className="font-bold text-sm tracking-wide leading-relaxed">End Time</span>
              <span className="text-base font-medium tracking-wide">
                {' '}
                {moment(reservation?.Event.endTime)
                  .tz('America/Toronto')
                  .utc()
                  .format('DD MMM, YYYY [at] HH:mma')}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Name</span>
              <span className="text-base font-normal tracking-wide">{reservation?.Event.name}</span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Location</span>
              <span className="text-base font-normal tracking-wide">{reservation?.Event.location}</span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-6">
            <div className="text-left w-full ml-3 flex flex-col">
              <span className="font-bold text-sm ">Event Capacity</span>
              <span className="text-base font-normal tracking-wide">{reservation?.Event.capacity}</span>
            </div>
          </div>
        </Box>
      </div>
      {/* Make this block be rendered depedning on condition */}
      <Box bg={useColorModeValue('white', 'gray.700')} className="my-4 p-5 shadow-lg rounded-lg w-full">
        <Heading as="h2" size="md" my={3}>
          Payments
        </Heading>
      </Box>
    </main>
  );
};

export default ReservationView;
