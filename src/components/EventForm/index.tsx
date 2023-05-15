import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { FormControl, Input, useColorModeValue, Button, Flex, FormLabel, Heading, Box, TimePicker } from '@chakra-ui/react';

import MessageBar from '../MessageBar';
import { Event } from '../../types';
import { createEvent, findEventById, updateEvent } from './calls';
import { AppContext } from '../../context/AppContext';

export function EventForm(props: { onNext: () => void; event?: Event; eventId?: number | null; onEventStatusUpdate: (val: number) => void }) {
  const { appLoading, setAppLoading } = useContext<any>(AppContext);
  const [error, setError] = useState(false);
  const [messageBar, setMessageBar] = useState<any>({});
  const [minEndDate, setMinEndDate] = useState('');
  const [formValues, setFormValues] = useState<Event>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateEventObj = (newEvent: Event) => {
    setFormValues((prevState) => ({
      ...prevState,
      ...newEvent,
    }));
  };

  const doFetchEvent = async () => {
    setAppLoading(true);
    setError(false);

    try {
      const response = await findEventById(props.eventId);

      if (!response.success) {
        setError(true);
        setMessageBar({ type: 'error', message: response.data });
        throw new Error(response.data);
      }

      // setEvent(response.data);
      props.onEventStatusUpdate(response.data.StatusId);
      updateEventObj(response.data);
    } catch (error: any) {
      console.error('Error : ', { ...error });
    }
    setAppLoading(false);
  };

  const doCreateEvent = async () => {
    setAppLoading(true);
    setError(false);

    if (!validateForm()) {
      setAppLoading(false);
      return;
    }

    try {
      const event = { ...formValues };

      let response: any = null;
      if (props.eventId) {
        response = await updateEvent(event);
      } else {
        response = await createEvent(event);
      }

      if (!response.success) {
        setError(true);
        setMessageBar({
          type: 'error',
          message: 'Unexpected error while trying to create an Event',
        });
        throw new Error(`There was an error while tryting to create the Event ${response.data}`);
      }
      updateEventObj(response.data);
      props.onNext();
    } catch (error: any) {
      console.error('Unexpected error: ', error.message);
    }
    setAppLoading(false);
  };

  const resetForm = () => {
    setFormValues({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: 0,
    });
    setError(false);
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formValues.name.length) {
      errors.nameError = true;
    }
    if (!formValues.startTime.length) {
      errors.startTime = true;
    }
    if (!formValues.endTime.length) {
      errors.endTime = true;
    }

    if (Object.keys(errors).length) {
      setError(true);
      setMessageBar({
        type: 'error',
        message: 'The form contains errors. Please enter all required information',
      });
      return false;
    }

    setError(false);
    setMessageBar({});
    return true;
  };

  /**
   * Format the date for the calendar component
   * @param date
   * @returns
   */
  const formatDate = (date: Date) => moment(date).tz('America/Toronto').format('YYYY-MM-DDTHH:mm');

  /**
   * Make sure that end date is not before the start date
   */
  useEffect(() => {
    if (formValues.startTime && formValues.startTime.length && !formValues.endTime && formValues.endTime.length) {
      const tempDate = formatDate(new Date(formValues.startTime));
      setFormValues((prevState) => ({
        ...prevState,
        endTime: tempDate,
      }));
      setMinEndDate(tempDate);
    }
  }, [formValues.startTime]);

  useEffect(() => {
    if (props.eventId) {
      doFetchEvent();
    }
  }, []);

  /**
   * Cleanup form on unmount event
   */
  useEffect(() => {
    return () => resetForm();
  }, []);

  return (
    <>
      <Box mt="15px">
        <Heading as="h3" size="lg" my={5}>
          Fill in Event information
        </Heading>
      </Box>
      {error && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box>
        <FormControl isRequired>
          <FormLabel>Event Name</FormLabel>
          <Input type="text" name="name" value={formValues.name} disabled={appLoading} onChange={handleInputChange} />
        </FormControl>
        <FormControl mt={5} isRequired>
          <FormLabel>Event Description</FormLabel>
          <Input type="text" name="description" value={formValues.description} disabled={appLoading} onChange={handleInputChange} />
        </FormControl>
        <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
          <FormControl mt={5} mr={{ base: '0', md: '5' }} isRequired>
            <FormLabel>Start time</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={formatDate(formValues.startTime && formValues.startTime.length ? new Date(formValues.startTime) : new Date())}
              onChange={handleInputChange}
              disabled={appLoading}
              min={formatDate(new Date())} // set min to current date
            />
          </FormControl>
          <FormControl mt={5} ml={{ base: '0', md: '5' }} isRequired>
            <FormLabel>End time</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={formatDate(new Date(formValues.endTime))}
              disabled={appLoading}
              onChange={handleInputChange}
              min={minEndDate} // set min to current date
            />
          </FormControl>
        </Flex>
        <FormControl mt={5} isRequired>
          <FormLabel>Location</FormLabel>
          <Input type="text" name="location" value={formValues.location} disabled={appLoading} onChange={handleInputChange} />
        </FormControl>
        <FormControl mt={5} isRequired>
          <FormLabel>Event Capacity</FormLabel>
          <Input type="number" name="capacity" value={formValues.capacity} disabled={appLoading} onChange={handleInputChange} />
        </FormControl>
      </Box>
      <Flex>
        <Button
          mt={7}
          _hover={{
            bg: useColorModeValue('green.400', 'green.500'),
          }}
          color={useColorModeValue('white', 'gray.100')}
          bg={useColorModeValue('green.500', 'green.600')}
          disabled={appLoading}
          onClick={doCreateEvent}
        >
          {props.eventId ? <span>Update Event</span> : <span>Create Event</span>}
        </Button>
        <Button
          mt={7}
          mx={4}
          _hover={{
            bg: useColorModeValue('red.200', 'red.500'),
          }}
          color={useColorModeValue('white', 'gray.100')}
          bg={useColorModeValue('red.300', 'red.600')}
          disabled={appLoading}
          onClick={resetForm}
        >
          Reset Form
        </Button>
      </Flex>
    </>
  );
}
