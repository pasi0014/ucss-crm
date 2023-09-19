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
import EventList from '../../components/EventList';
import { Tabs } from '@chakra-ui/react';
import { TabList } from '@chakra-ui/react';
import { Tab } from '@chakra-ui/react';

import './styles.scss';

const Events = (props: any) => {
  const navigate = useNavigate();
  const { setAppLoading } = useContext<any>(AppContext);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [eventDate, setEventDate] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>('');

  const [scrollDirection, setScrollDirection] = useState('down');

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
  const bg = useColorModeValue('', '');

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
      {messageBar && <MessageBar type={messageBar.type} message={messageBar?.message}></MessageBar>}

      {/* Will be hidden on mobile */}
      <Box className="hidden lg:block">
        <Tabs className="mb-5">
          <TabList>
            <Tab onClick={() => setSelectedStatus(-1)}>All</Tab>
            {props.statuses &&
              Object.entries(props.statuses.Event).map(([key, value]) => (
                <Tab key={value} onClick={() => setSelectedStatus(value)} isDisabled={!events.length}>
                  {key}
                </Tab>
              ))}
          </TabList>
        </Tabs>
      </Box>

      {/* Event List and filtering */}
      <Box className="flex lg:flex-row flex-col-reverse w-full h-full relative">
        {props.statuses && !!events.length ? (
          <Box className="lg:w-8/12 w-full">
            <EventList onEdit={onEditRecord} onOpen={onOpenRecord} statuses={props.statuses} events={events} />
          </Box>
        ) : (
          <Box className="lg:w-8/12 w-full">
            <Box bg={useColorModeValue('white', 'gray.600')} className="p-20 flex-col items-center items-top justify-between rounded-xl shadow justify-between">
              <Text fontSize="xl" className="font-bold">
                There are no Events :/
              </Text>
              <Text>Yet we encourage you to create one</Text>
              <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={handleOpenDrawer} my={{ base: 5, sm: 15 }}>
                {/* <AddIcon boxSize={3} mr={3} /> */}
                Create event
              </Button>
            </Box>
          </Box>
        )}

        {/* Mobile Filtering - Make this Box stick to the top of the page when scrolling */}
        <Box
          className={`lg:w-4/12 w-full p-3 h-full flex flex-col rounded-xl shadow lg:ml-5 mb-10 ${scrollDirection === 'up' ? 'hide-sticky' : 'show-sticky'}`}
          bg={wrapperBg}
          style={{
            position: 'sticky',
            top: 5,
            right: 5,
          }}
        >
          <Box className="block lg:hidden overflow-scroll">
            <Tabs className="mb-5">
              <TabList>
                {props.statuses &&
                  Object.keys(props.statuses.Event).map((iStatusKey: string) => (
                    <Tab key={iStatusKey} onClick={() => console.log('ONE')}>
                      {iStatusKey}
                    </Tab>
                  ))}
              </TabList>
            </Tabs>
          </Box>
          <Flex className="w-full mb-3 flex lg:flex-col flex-row">
            <div className="lg:mx-0 mx-3 lg:w-full w-6/12">
              <Text className="text-relaxed font-medium ml-1 mb-2" color={inputBg}>
                Search for an event
              </Text>
              <InputGroup>
                <Input
                  bg={wrapperBg}
                  shadow="sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(val: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(val.target.value)}
                />
                <InputRightElement>
                  <IconButton color={useColorModeValue('gray.600', 'gray.50')} aria-label="Search" icon={<SearchIcon />} onClick={handleSearch} />
                </InputRightElement>
              </InputGroup>
            </div>

            <div className="lg:w-full w-6/12 flex sm:flex-row flex-col mt-5">
              <Flex className="w-full flex flex-col">
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
            </div>
          </Flex>

          <div className="w-full justify-end mt-3 flex sm:flex-row flex-col">
            <Button variant={'solid'} colorScheme={'blue'} size={'md'} mr={4} onClick={handleOpenDrawer} my={{ base: 5, sm: 15 }}>
              <SearchIcon boxSize={3} mr={3} />
              Search
            </Button>
            <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={handleOpenDrawer} my={{ base: 5, sm: 15 }}>
              <AddIcon boxSize={3} mr={3} />
              Create an event
            </Button>
          </div>
        </Box>
      </Box>

      {props.statuses && <EventFormDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} eventId={selectedEventId} statuses={props.statuses} />}
    </React.Fragment>
  );
};

export default withStatusFetching(Events);
