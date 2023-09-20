import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

import { useNavigate, useParams } from 'react-router-dom';

import {
  Text,
  Flex,
  useColorModeValue,
  Box,
  Heading,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
} from '@chakra-ui/react';
import {
  getEventById,
  getEventClients,
  getEventReservation,
  getEventSales,
} from './calls';

import { FiUsers } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';

import { Event } from '../../types/Event';

import ReservationList from '../../components/ReservationList';
import ReservationDrawer from '../../components/ReservationDrawer';
import MessageBar, { IMessageBar } from '../../components/MessageBar';
import { Reservation } from '../../types/Reservation';

import withStatusFetching from '../../context/withStatus';
import PriceList from '../../components/PriceList';
import QRScanner from '../../components/QRScanner';

type EventParams = {
  eventId: any;
};

const EventView: React.FC = (props: any) => {
  const { eventId } = useParams<EventParams>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<any>([]);
  const [reservationClients, setReservationClients] = useState<number | null>(
    null,
  );
  const [eventSales, setEventSales] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const [reservationCode, setReservationCode] = useState('');

  const bgColor = useColorModeValue('white', 'gray.700');
  const infoBg = useColorModeValue('gray.50', 'gray.700');

  const doFetchEvent = async () => {
    setLoading(true);
    setMessageBar(null);

    try {
      const response = await getEventById(parseInt(eventId, 10));

      if (!response.success) {
        throw new Error(response.data);
      }

      if (response.data === null)
        throw new Error(`An error occurred while trying to get the Event`);
      setSelectedEvent(response.data);
    } catch (error: any) {
      console.error(
        `Unexpected error while getting the Event : ${error.message}`,
        { ...error },
      );
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (eventId && props.statuses) {
      doFetchEvent();
    }
  }, [props.statuses]);

  const doFetchEventReservations = async (eventId: number) => {
    setLoading(true);

    try {
      const response = await getEventReservation(eventId);
      if (!response.success) {
        throw new Error(response.data);
      }
      setReservations(response.data);
    } catch (error: any) {
      console.error(`Unepxected error : ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  const doFetchReservationClients = async (eventId: number) => {
    setLoading(true);

    try {
      const response = await getEventClients(eventId);
      if (!response.success) {
        throw new Error(response.data);
      }
      setReservationClients(response.data);
    } catch (error: any) {
      console.error(`Error : ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  const doFetchEventSales = async (eventId: number) => {
    setLoading(true);

    try {
      const response = await getEventSales(eventId);
      if (!response.success) {
        throw new Error(response.data);
      }
      setEventSales(response.data);
    } catch (error: any) {
      console.error(`Error : ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  const handleOpenDrawer = () => {
    setDrawerIsOpen(true);
  };

  // Statistics fetching
  useEffect(() => {
    if (selectedEvent && selectedEvent.id) {
      doFetchEventReservations(selectedEvent.id);
      doFetchReservationClients(selectedEvent.id);
      doFetchEventSales(selectedEvent.id);
    }
  }, [selectedEvent]);

  return (
    <React.Fragment>
      {/* Title */}
      {messageBar && (
        <Stack>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Stack>
      )}

      {!selectedEvent && !loading && (
        <Box textAlign="center" py={10} px={6}>
          <Heading
            display="inline-block"
            as="h2"
            size="2xl"
            bgGradient="linear(to-r, teal.400, teal.600)"
            backgroundClip="text"
          >
            404
          </Heading>
          <Text fontSize="18px" mt={3} mb={2}>
            Event Not Found
          </Text>
          <Text color={'gray.500'} mb={6}>
            The record you're looking for does not seem to exist
          </Text>
        </Box>
      )}

      {selectedEvent && (
        <>
          <Stack>
            <Box textAlign="left" my={5} p={3}>
              <Heading>{selectedEvent.name}</Heading>
            </Box>
          </Stack>

          {/* Stats */}
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <Box
              bg={bgColor}
              width={{ md: `350px`, sm: '100%' }}
              p="5"
              borderRadius="15px"
              boxShadow="lg"
              my={{ base: 5, md: 0 }}
              mx={{ base: 0, md: 2 }}
            >
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Total Clients
                    </Heading>
                    <Box
                      display={{ base: 'none', md: 'flex' }}
                      color="#FFFFFF"
                      bg="#3182CE"
                      p="3"
                      borderRadius="15px"
                    >
                      <FiUsers size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">{reservationClients || 0}</Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box
              bg={bgColor}
              width={{ md: `350px`, sm: '100%' }}
              p="5"
              borderRadius="15px"
              boxShadow="lg"
              my={{ base: 5, md: 0 }}
              mx={{ base: 0, md: 2 }}
            >
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Total Reservations
                    </Heading>
                    <Box
                      display={{ base: 'none', md: 'flex' }}
                      color="#FFFFFF"
                      bg="#3182CE"
                      p="3"
                      borderRadius="15px"
                    >
                      <FiUsers size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">
                    {reservations.length &&
                      (reservations.filter(
                        (iReservation: Reservation) =>
                          iReservation.StatusId !==
                          props.statuses.Reservation.CANCELLED,
                      ).length ||
                        0)}
                  </Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box
              bg={bgColor}
              width={{ md: `350px`, sm: '100%' }}
              p="5"
              borderRadius="15px"
              boxShadow="lg"
              my={{ base: 5, md: 0 }}
              mx={{ base: 0, md: 2 }}
            >
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Event Capacity
                    </Heading>
                    <Box
                      display={{ base: 'none', md: 'flex' }}
                      color="#FFFFFF"
                      bg="#3182CE"
                      p="3"
                      borderRadius="15px"
                    >
                      <FiUsers size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">{selectedEvent.capacity}</Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box
              bg={bgColor}
              width={{ md: `350px`, sm: '100%' }}
              p="5"
              borderRadius="15px"
              boxShadow="lg"
              my={{ base: 5, md: 0 }}
              mx={{ base: 0, md: 2 }}
            >
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Total Sales
                    </Heading>
                    <Box
                      display={{ base: 'none', md: 'flex' }}
                      color="#FFFFFF"
                      bg="#3182CE"
                      p="3"
                      borderRadius="15px"
                    >
                      <FaMoneyBillWave size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">${eventSales || 0}</Text>
                </StatNumber>
              </Stat>
            </Box>
          </Flex>

          {/* Event Description */}
          <div className="flex lg:flex-row flex-col w-full">
            <Box
              bg={bgColor}
              className="shadow-md rounded-xl p-5 lg:w-6/12 w-full lg:mx-3 my-5"
            >
              <Heading as="h3" size="lg" mx={1} mb={4}>
                Event Info
              </Heading>

              <div className="flex flex-row justify-between w-full my-10">
                <div className="text-left w-full lg:ml-3 flex flex-col">
                  <span className="font-bold text-sm ">Start Time</span>
                  <span className="text-base font-medium tracking-wide">
                    {moment(selectedEvent.startTime)
                      .tz('America/Toronto')
                      .utc()
                      .format('DD MMM, YYYY [at] HH:mma')}
                  </span>
                </div>
                <div className="text-left w-full ml-10 flex flex-col">
                  <span className="font-bold text-sm tracking-wide leading-relaxed">
                    End Time
                  </span>
                  <span className="text-base font-medium tracking-wide">
                    {moment(selectedEvent.endTime)
                      .tz('America/Toronto')
                      .utc()
                      .format('DD MMM, YYYY [at] HH:mma')}
                  </span>
                </div>
              </div>
              <div className="w-full h-96">
                <Box
                  as="iframe"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBxr53jBD1xjSQcESLr86hAkmBpDJ4R690&q=${selectedEvent.location}`}
                ></Box>
              </div>
            </Box>
            {/* Tickets */}
            <Box
              bg={bgColor}
              className="shadow-md rounded-xl p-5 lg:w-6/12  w-full lg:mx-3 my-5"
            >
              <Heading as="h3" size="lg" className="mb-5">
                Tickets
              </Heading>
              {selectedEvent.saleStart && selectedEvent.saleEnd && (
                <div className="flex flex-row justify-between w-full my-10">
                  <div className="text-left w-full ml-3 flex flex-col">
                    <span className="font-bold text-sm ">
                      Tickets Sale Start
                    </span>
                    <span className="text-base font-medium tracking-wide">
                      {moment(selectedEvent.startTime)
                        .tz('America/Toronto')
                        .utc()
                        .format('DD MMM, YYYY [at] HH:mma')}
                    </span>
                  </div>
                  <div className="text-left w-full ml-10 flex flex-col">
                    <span className="font-bold text-sm tracking-wide leading-relaxed">
                      Ticket Sale End:
                    </span>
                    <span className="text-base font-medium tracking-wide">
                      {moment(selectedEvent.endTime)
                        .tz('America/Toronto')
                        .utc()
                        .format('DD MMM, YYYY [at] HH:mma')}
                    </span>
                  </div>
                </div>
              )}
              <div className="w-full h-full">
                {props.statuses && selectedEvent.Prices && (
                  <PriceList
                    prices={selectedEvent.Prices.filter(
                      (iPrice) =>
                        iPrice.StatusId === props.statuses.Price.ACTIVE,
                    )}
                  />
                )}
              </div>
            </Box>
          </div>

          {/* Reservations */}
          <Stack>
            <Box
              bg={bgColor}
              textAlign="left"
              my={5}
              p={5}
              borderRadius="15px"
              boxShadow="s"
            >
              <Heading as="h3" size="lg">
                Reservations for event
              </Heading>

              {props.statuses && (
                <ReservationList
                  eventId={eventId}
                  onCreate={handleOpenDrawer}
                  statuses={props.statuses}
                  onOpen={(val: Reservation) => {
                    navigate(`/events/${eventId}/reservation/${val.id}`);
                  }}
                />
              )}
            </Box>
          </Stack>
        </>
      )}
      {/* Drawers and other content */}
      <ReservationDrawer
        isOpen={drawerIsOpen}
        onClose={() => {
          setDrawerIsOpen(false);
          doFetchEventReservations(eventId);
        }}
        eventId={eventId}
      />
    </React.Fragment>
  );
};

export default withStatusFetching(EventView);
