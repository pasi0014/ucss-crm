import React, { ReactHTMLElement, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Flex, Button, Badge, useColorModeValue, Spacer, Input } from '@chakra-ui/react';
import Datetime from 'react-datetime';
import { AddIcon, CalendarIcon, SearchIcon } from '@chakra-ui/icons';

import { AppContext } from '../../context/AppContext';

import EventFormDrawer from '../../components/EventDrawer';
import ConfirmPopup from '../../components/ConfirmPopup';
import MessageBar, { IMessageBar } from '../../components/MessageBar';

import { deleteEvent, getEvents } from './calls';
import { Event } from '../../types/Event';
import { getStatus } from '../../utils/utilities';

import withStatusFetching from '../../context/withStatus';
import { InputGroup } from '@chakra-ui/react';
import { InputRightElement } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';

import 'react-datetime/css/react-datetime.css';
import { Text } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import EventList from '../../components/EventList';

const Events = (props: any) => {
  const navigate = useNavigate();
  const { setAppLoading } = useContext<any>(AppContext);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [eventDate, setEventDate] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>('');

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [fetchEvents, setFetchEvents] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const statusItems = useMemo(() => {
    if (props.statuses) {
      return Object.keys(props.statuses.Event).map((statusKey) => ({
        key: props.statuses.Event[statusKey],
        text: getStatus(props.statuses.Event, props.statuses.Event[statusKey]).tag,
      }));
    }
  }, [props.statuses]);

  const calendarBg = useColorModeValue('white', 'gray.600');
  const wrapperBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.500', 'gray.400');

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedEventId(null);
    setFetchEvents(true);
  };

  const onOpenRecord = (item: any) => {
    navigate(`/events/${item.id}`);
  };

  const onEditRecord = (item: any) => {
    setSelectedEventId(item.id);
    handleOpenDrawer();
  };

  const handleDeleteClick = (item: any) => {
    setShowConfirmation(true);
    setEventToDelete(item.id);
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    onDeleteRecord();
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
    setShowConfirmation(false);
  };

  const handleSearch = (term: string) => {
    console.log({ term });
  };

  const onDeleteRecord = async () => {
    setAppLoading();

    try {
      const response = await deleteEvent(eventToDelete);

      if (response.success) {
        setEvents(events.filter((iEvent: Event) => iEvent.id !== eventToDelete));
      }
    } catch (error: any) {
      console.error('Error : ', { error });
    }
    setAppLoading(false);
  };

  const doFetchEvents = async () => {
    setAppLoading(true);
    setMessageBar(null);
    setFetchEvents(false);

    try {
      const response = await getEvents();

      if (!response.success) {
        throw new Error('There was an error while loading the Events. Please try again.');
      }

      setEvents(response.data);
    } catch (error: any) {
      setMessageBar({ type: 'error', message: error.message });
      console.error(`Error: ${error.message}`, { ...error });
    }

    setAppLoading(false);
  };

  useEffect(() => {
    if (fetchEvents) doFetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (props.statuses) {
      doFetchEvents();
    }
  }, [props.statuses]);

  const onRenderInput = (props: any, openCalendar: any, closeCalendar: any) => {
    return (
      <Flex direction="row">
        <InputGroup>
          <Input {...props} />
          <InputRightElement>
            <IconButton aria-label="Search" icon={<CalendarIcon />} onClick={() => openCalendar()} />
          </InputRightElement>
        </InputGroup>
      </Flex>
    );
  };

  const renderCalendar = (mode: any, renderDefault: any) => {
    // Only for years, months and days view
    if (mode === 'time') return renderDefault();

    return (
      <Box className="" bg={calendarBg}>
        {renderDefault()}
      </Box>
    );
  };
  return (
    <React.Fragment>
      <Box textAlign="left" my={5} p={3}>
        <Heading>My Events</Heading>
      </Box>

      <ConfirmPopup
        isOpen={showConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
      {messageBar != null ? (
        <MessageBar type={messageBar.type} message={messageBar?.message}></MessageBar>
      ) : (
        <Box>
          <Box bg={wrapperBg} p={3} borderRadius="10px" boxShadow="sm" mb={5}>
            {/* Wrapper */}
            <div className="w-full flex lg:flex-row flex-col items-center">
              {/* Filters */}
              <div className="flex lg:flex-row flex-col lg:space-x-4 w-full">
                <Box className="lg:w-8/12 w-full mb-3 flex flex-col">
                  <Text className="text-relaxed font-medium ml-1 mb-2" color={inputBg}>
                    Search for an event
                  </Text>
                  <InputGroup>
                    <Input
                      bg={wrapperBg}
                      shadow="md"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(val: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(val.target.value)}
                    />
                    <InputRightElement>
                      <IconButton color={useColorModeValue('gray.600', 'gray.50')} aria-label="Search" icon={<SearchIcon />} onClick={handleSearch} />
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <div className="w-full flex sm:flex-row flex-col">
                  <Flex className="lg:w-4/12 w-full flex flex-col sm:mr-4 m-0">
                    <Text className="font-medium ml-1 mb-2" color={inputBg}>
                      Date
                    </Text>
                    <Datetime
                      inputProps={{ className: 'border-2 p-2 rounded-lg w-full', placeholder: 'Select a date' }}
                      className="border-1 border-gray-600 rounded-lg shadow-sm w-full "
                      renderInput={onRenderInput}
                      timeFormat={false}
                      renderView={renderCalendar}
                      dateFormat={'DD MMM, YYYY'}
                      value={eventDate}
                    />
                  </Flex>
                  {statusItems && statusItems.length && (
                    <Box className="sm:w-4/12 w-full flex flex-col">
                      <Text className="font-medium ml-1 mb-2" color={inputBg}>
                        Status
                      </Text>
                      <Select
                        placeholder="Select a status"
                        className="text-gray-400"
                        value={selectedStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setSelectedStatus(e.target.value);
                        }}
                      >
                        {statusItems.map((status: any) => (
                          <option key={status.key} value={status.key}>
                            {status.text}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  )}
                </div>
              </div>

              <div className="lg:w-4/12 justify-end w-full mt-3 flex sm:flex-row flex-col">
                <Button variant={'solid'} colorScheme={'blue'} size={'md'} mr={4} onClick={handleOpenDrawer} my={{ base: 5, sm: 15 }}>
                  <SearchIcon boxSize={3} mr={3} />
                  Search
                </Button>
                <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={handleOpenDrawer} my={{ base: 5, sm: 15 }}>
                  <AddIcon boxSize={3} mr={3} />
                  Create an event
                </Button>
              </div>
            </div>
          </Box>
          {props.statuses && !!events.length && <EventList onEdit={onEditRecord} onOpen={onOpenRecord} statuses={props.statuses} events={events} />}
        </Box>
      )}

      {props.statuses && <EventFormDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} eventId={selectedEventId} statuses={props.statuses} />}
    </React.Fragment>
  );
};

export default withStatusFetching(Events);
