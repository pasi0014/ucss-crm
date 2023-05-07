import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading, Flex, Button, useDisclosure, useColorModeValue } from '@chakra-ui/react';

import moment from 'moment';

import { AppContext } from '../../context/AppContext';

import DataTable from '../../components/DataTable';
import EventFormDrawer from '../../components/EventDrawer';

import { deleteEvent, getEvents } from './calls';
import { IColumnProps } from '../../interfaces';
import { Event } from '../../types';
import ConfirmPopup from '../../components/ConfirmPopup';

export default function Events() {
  const { setAppLoading } = useContext<any>(AppContext);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [events, setEvents] = useState<any>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [fetchEvents, setFetchEvents] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [messageBar, setMessageBar] = useState<any>({});

  const columns: IColumnProps[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Start Time', accessor: 'startTime', render: (value) => moment(value).tz('America/Toronto').utc().format('YYYY-MM-DD hh:mm A') },
    { header: 'End Time', accessor: 'endTime', render: (value) => moment(value).tz('America/Toronto').utc().format('YYYY-MM-DD hh:mm A') },
    { header: 'Location', accessor: 'location' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created At', accessor: 'createdAt', render: (value) => moment(value).tz('America/Toronto').utc().format('YYYY-MM-DD hh:mm A') },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Updated At', accessor: 'updatedAt', render: (value) => moment(value).tz('America/Toronto').utc().format('YYYY-MM-DD hh:mm A') },
    { header: 'Updated By', accessor: 'updatedBy' },
  ];

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedEventId(null);
    setFetchEvents(true);
  };

  const onOpenRecord = (item: any) => {
    console.log(`Opening record ${item.id}`);
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
    setMessageBar({});
    setFetchEvents(false);

    try {
      const response = await getEvents();

      if (!response.success) {
        throw new Error('Unexpected error : could not fetch the events');
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
    doFetchEvents();
  }, []);

  return (
    <React.Fragment>
      <Box textAlign="left" my={5} p={3}>
        <Heading>Events</Heading>
      </Box>
      <Box bg={useColorModeValue('white', 'gray.700')} px={4} width="350px" borderRadius="15px" boxShadow="base">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>
            <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={handleOpenDrawer}>
              Create an event
            </Button>
          </Flex>
        </Flex>
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
      <DataTable
        columns={columns}
        items={events}
        onOpenRecord={onOpenRecord}
        onEditRecord={onEditRecord}
        onDeleteRecord={handleDeleteClick}
        dataDescription="Events"
      />
      <EventFormDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} eventId={selectedEventId} />
    </React.Fragment>
  );
}
