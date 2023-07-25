import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Text, Flex, useColorModeValue, Box, Heading, Stack, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { AppContext } from '../../context/AppContext';
import { getEventById, getEventClients, getEventReservation, getEventSales } from './calls';

import { FiUsers } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { AddIcon } from '@chakra-ui/icons';

import { Event } from '../../types/Event';

import ReservationDrawer from '../../components/ReservationDrawer';
import MessageBar, { IMessageBar } from '../../components/MessageBar';
import { Reservation } from '../../types/Reservation';
import DataTable from '../../components/DataTable';
import { IColumnProps } from '../../interfaces';
import moment from 'moment';
import { Badge } from '@chakra-ui/react';
import { getStatus, getStatusColor } from '../../utils/utilities';
import { StatusContext } from '../../context/StatusContext';
import { Spinner } from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';

type EventParams = {
  eventId: any;
};

const EventView: React.FC = () => {
  const { eventId } = useParams<EventParams>();
  const navigate = useNavigate();
  const { setAppLoading, appLoading } = useContext<any>(AppContext);
  const { statuses } = useContext<any>(StatusContext);

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<any>([]);
  const [reservationClients, setReservationClients] = useState<number | null>(null);
  const [eventSales, setEventSales] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const bgColor = useColorModeValue('white', 'gray.700');

  const columns: IColumnProps[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Guest Name',
      accessor: 'ClientLists',
      render: (ClientLists) => {
        const owner = ClientLists.find((iClient: any) => reservations.find((iReservation: Reservation) => iReservation.OwnerId === iClient.ClientId)).Client;
        return `${owner.firstName} ${owner.lastName}`;
      },
    },
    {
      header: 'Phone',
      accessor: 'OwnerId',
      render: (OwnerId) => {
        const owner = reservations.find((iReservation: any) =>
          iReservation.ClientLists.find((iCLientList: any) => iCLientList.Client.id === OwnerId),
        ).ClientLists;
        const client = owner.find((iClient: any) => iClient.Client.id === OwnerId);
        return `${client.Client.phone}`;
      },
    },
    {
      header: 'Status',
      accessor: 'StatusId',
      render: (value) => (
        <Badge colorScheme={getStatusColor(getStatus(statuses.Reservation, value).tag || '')}>{getStatus(statuses.Reservation, value).tag}</Badge>
      ),
    },
    { header: 'Created At', accessor: 'createdAt', render: (value) => moment(value).tz('America/Toronto').format('YYYY-MM-DD HH:mm') },
    { header: 'Created By', accessor: 'createdBy' },
  ];

  const doFetchEvent = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await getEventById(parseInt(eventId, 10));

      if (!response.success) {
        throw new Error(response.data);
      }

      if (response.data === null) throw new Error(`An Error occurred while trying to get the Event`);
      setSelectedEvent(response.data);
      setAppLoading(false);
    } catch (error: any) {
      console.error(`Unexpected error while getting the Event : ${error.message}`, { ...error });
      setMessageBar({ type: 'error', message: error.message });
    }
  };

  useEffect(() => {
    if (eventId) {
      doFetchEvent();
    }
  }, []);

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

      {!selectedEvent && !appLoading && (
        <Box textAlign="center" py={10} px={6}>
          <Heading display="inline-block" as="h2" size="2xl" bgGradient="linear(to-r, teal.400, teal.600)" backgroundClip="text">
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
          <Stack my={25} spacing="24px" direction={['column', 'row']}>
            <Box bg={bgColor} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Total Clients
                    </Heading>
                    <Box display={{ base: 'none', md: 'flex' }} color="#FFFFFF" bg="#3182CE" p="3" borderRadius="15px">
                      <FiUsers size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">{reservationClients || 0}</Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box bg={bgColor} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Total Reservations
                    </Heading>
                    <Box display={{ base: 'none', md: 'flex' }} color="#FFFFFF" bg="#3182CE" p="3" borderRadius="15px">
                      <FiUsers size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">
                    {reservations.length &&
                      (reservations.filter((iReservation: Reservation) => iReservation.StatusId !== statuses.Reservation.CANCELLED).length || 0)}
                  </Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box bg={bgColor} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Event Capacity
                    </Heading>
                    <Box display={{ base: 'none', md: 'flex' }} color="#FFFFFF" bg="#3182CE" p="3" borderRadius="15px">
                      <FiUsers size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">{selectedEvent.capacity}</Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box bg={bgColor} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
              <Stat>
                <StatLabel mb={2}>
                  <Flex justifyContent={'space-between'}>
                    <Heading as="h2" size="md">
                      Total Sales
                    </Heading>
                    <Box display={{ base: 'none', md: 'flex' }} color="#FFFFFF" bg="#3182CE" p="3" borderRadius="15px">
                      <FaMoneyBillWave size={28} />
                    </Box>
                  </Flex>
                </StatLabel>
                <StatNumber>
                  <Text fontSize="4xl">${eventSales || 0}</Text>
                </StatNumber>
              </Stat>
            </Box>
          </Stack>

          {/* Event Description */}
          <Stack>
            <Box bg={bgColor} textAlign="left" my={5} p={5} borderRadius="15px" boxShadow="sm">
              <Heading as="h3" size="lg">
                Event Description
              </Heading>

              <Box my={2} mx={2}>
                <Text>{selectedEvent.description}</Text>
              </Box>
            </Box>
          </Stack>

          {/* Reservations */}
          <Stack>
            <Box bg={bgColor} textAlign="left" my={5} p={5} borderRadius="15px" boxShadow="s">
              <Heading as="h3" size="lg">
                Reservations
              </Heading>

              {/* Action Buttons */}
              <Box mt="3">
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                  <Flex alignItems={'center'}>
                    <Button variant={'solid'} colorScheme={'teal'} size={'md'} onClick={handleOpenDrawer}>
                      <AddIcon boxSize={3} mr={3} />
                      Create a Reservation
                    </Button>
                  </Flex>
                </Flex>
              </Box>

              {/* DataTable */}
              {loading && (
                <Center>
                  <Spinner />
                </Center>
              )}
              {reservations.length > 0 && !loading && (
                <DataTable
                  columns={columns}
                  items={reservations}
                  onOpenRecord={(val: any) => {
                    navigate(`/events/${eventId}/reservation/${val.id}`);
                  }}
                  onEditRecord={(val: any) => console.log({ val })}
                  onDeleteRecord={(val: any) => console.log({ val })}
                  dataDescription="Reservations"
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

export default EventView;
