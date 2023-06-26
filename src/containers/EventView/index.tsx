import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Text, Flex, useColorModeValue, Box, Heading, Stack, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { AppContext } from '../../context/AppContext';
import { getEventById } from './calls';

import { FiUsers } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { AddIcon } from '@chakra-ui/icons';

import { Event } from '../../types';

import ReservationDrawer from '../../components/ReservationDrawer';
import MessageBar from '../../components/MessageBar';

type EventParams = {
  eventId: any;
};

const EventView: React.FC = () => {
  const { eventId } = useParams<EventParams>();
  const { setAppLoading, appLoading } = useContext<any>(AppContext);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const [messageBar, setMessageBar] = useState<any>(null);

  const doFetchEvent = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await getEventById(parseInt(eventId, 10));

      if (!response.success) {
        throw new Error(response.data);
      }

      if (response.data === null) throw new Error(`An Error occurred while trying to get the Event`);

      setEvent(response.data);
    } catch (error: any) {
      console.error(`Unexpected error while getting the Event : ${error.message}`, { ...error });
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  const doFetchEventReservations = async (eventId: number) => {
    setLoading(true);
    try {
      const response = {};
    } catch (error: any) {
      console.error(`Unepxected error : ${error.message}`);
    }
    setLoading(false);
  };

  const handleOpenDrawer = () => {
    setDrawerIsOpen(true);
  };

  useEffect(() => {
    if (eventId) {
      doFetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    if (event?.id) {
      doFetchEventReservations(event.id);
    }
  }, [event]);

  return (
    <React.Fragment>
      {/* Title */}
      {messageBar && (
        <Stack>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Stack>
      )}

      {!event && !appLoading && (
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

      {event && (
        <>
          <Stack>
            <Box textAlign="left" my={5} p={3}>
              <Heading>{event.name}</Heading>
            </Box>
          </Stack>

          {/* Stats */}
          <Stack my={25} spacing="24px" direction={['column', 'row']}>
            <Box bg={useColorModeValue('white', 'gray.700')} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
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
                  <Text fontSize="4xl">0</Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box bg={useColorModeValue('white', 'gray.700')} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
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
                  <Text fontSize="4xl">{event?.capacity}</Text>
                </StatNumber>
              </Stat>
            </Box>
            <Box bg={useColorModeValue('white', 'gray.700')} width={{ md: `350px`, sm: '100%' }} p="5" borderRadius="15px" boxShadow="lg">
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
                  <Text fontSize="4xl">$0</Text>
                </StatNumber>
              </Stat>
            </Box>
          </Stack>

          {/* Event Description */}
          <Stack>
            <Box bg={useColorModeValue('white', 'gray.700')} textAlign="left" my={5} p={5} borderRadius="15px" boxShadow="sm">
              <Heading as="h3" size="lg">
                Event Description
              </Heading>

              <Box my={2} mx={2}>
                <Text>{event?.description}</Text>
              </Box>
            </Box>
          </Stack>

          {/* Reservations */}
          <Stack>
            <Box bg={useColorModeValue('white', 'gray.700')} textAlign="left" my={5} p={5} borderRadius="15px" boxShadow="s">
              <Heading as="h3" size="lg">
                Orders
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
            </Box>
          </Stack>
        </>
      )}
      {/* Drawers and other content */}
      <ReservationDrawer isOpen={drawerIsOpen} onClose={() => setDrawerIsOpen(false)} eventId={eventId} />
    </React.Fragment>
  );
};

export default EventView;
