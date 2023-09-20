import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { FormControl, Input, useColorModeValue, Button, Flex, FormLabel, Heading, Box } from '@chakra-ui/react';

import imageCompression from 'browser-image-compression';

import MessageBar from '../MessageBar';
import { Event } from '../../types/Event';
import { createEvent, fetchLocationSuggestions, findEventById, updateEvent } from './calls';
import { AppContext } from '../../context/AppContext';
import RichTextEditor from '../RichTextEditor';
import { Spinner } from '@chakra-ui/react';
import { Fade } from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react';

export default function EventForm(props: { onNext: () => void; event?: Event; eventId?: number | null; onEventUpdate: (eventId: number) => void }) {
  const { appLoading, setAppLoading } = useContext<any>(AppContext);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLocationFetching, setIsLocationFetching] = useState(false);
  const [error, setError] = useState(false);
  const [messageBar, setMessageBar] = useState<any>({});
  const [minEndDate, setMinEndDate] = useState('');
  const [formValues, setFormValues] = useState<Event>({
    name: '',
    imageURL: null,
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0,
  });

  const borderColor = useColorModeValue('border-gray-300', 'border-gray-500');
  const resultBg = useColorModeValue('white', 'gray.500');

  const doGetLocationSuggestions = async (inputValue: string) => {
    setIsLocationFetching(true);
    try {
      const response = await fetchLocationSuggestions(inputValue);
      if (!response.success) {
        throw new Error('Could not fetch location suggestion');
      }
      setLocationSuggestions(response.data.items.map((item: any) => item.address.label));
      setIsLocationFetching(false);
    } catch (error: any) {
      console.error('Error fetching location suggestions:', error);
    }
    setIsLocationFetching(false);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (value.length !== 0 && value.length >= 3) {
      // Fetch location suggestions after 1.5 seconds of input change
      setTimeout(() => {
        doGetLocationSuggestions(value);
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (val: any) => {
    setFormValues((prevState) => ({
      ...prevState,
      description: val,
    }));
  };

  const handleImageChange = async (e: any) => {
    const selectedImage = e.target.files[0];
    // Check if a file was selected
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(selectedImage, options);
    if (compressedFile) {
      // Display a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setFormValues((prevState) => ({
          ...prevState,
          imageURL: reader.result,
        }));
      };
      reader.readAsDataURL(compressedFile);
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        imageURL: null,
      }));
    }
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
      props.onEventUpdate(response.data.id);
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
      imageURL: null,
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
    <Box>
      <Box mt="15px">
        <Heading as="h3" size="lg" my={5} mx={{ base: '15px', sm: '5px' }}>
          Fill in Event information
        </Heading>
      </Box>
      {error && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box
        className={`${borderColor} border w-full rounded-lg flex flex-col items-center my-6`}
        p={{ base: '0px', md: '25px' }}
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Event Information</span>
            <span className="mt-2 text-sm w-10/12">This information will be used to be displayed on the website.</span>
          </Box>
          <Box className="sm:w-10/12 w-full p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
                <FormLabel>Event Name</FormLabel>
                <Input type="text" name="name" value={formValues.name} disabled={appLoading} onChange={handleInputChange} />
              </FormControl>
            </Flex>
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" mt={5}>
              <FormControl mr="5%" isRequired>
                <FormLabel>Event Description</FormLabel>
                <RichTextEditor initialContent={formValues.description} onSave={handleDescriptionChange} />
              </FormControl>
            </Flex>
          </Box>
        </Box>
        {/* DIVIDER */}
        <Divider my={10} />
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Event Image</span>
            <span className="mt-2 text-sm w-10/12">Upload an image, it will be used as a event main image.</span>
          </Box>
          <Box className="sm:w-10/12 w-full p-3">
            <Flex direction={{ base: 'column' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
                <Input type="file" accept="image/*" onChange={handleImageChange} p={1} />
              </FormControl>
              <Box my={5}>{formValues.imageURL && <img src={formValues.imageURL} alt="Preview" style={{ maxWidth: '100px' }} />}</Box>
            </Flex>
          </Box>
        </Box>
        <Divider my={10} />

        {/* Date and location */}
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Date and location</span>
            <span className="mt-2 text-sm w-10/12">Please, fill in the location's date and location.</span>
          </Box>
          <Box className="w-10/12 p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
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
              <FormControl mr="5%" ml={{ base: '0', md: '5' }} isRequired>
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
            <Flex direction={{ base: 'column' }} justifyContent="space-between" mt={5}>
              <FormControl mt={5} isRequired>
                <FormLabel>Location</FormLabel>
                <Input type="text" name="location" value={formValues.location} disabled={appLoading} onChange={handleLocationInputChange} />
              </FormControl>

              <Box>
                {isLocationFetching && (
                  <Flex p={5}>
                    <Spinner size="sm" mr={2} />
                    Loading...
                  </Flex>
                )}
                {locationSuggestions.length > 0 && (
                  <Fade in={!!locationSuggestions.length}>
                    <Box bg={resultBg} boxShadow="md" p={3} mt={3}>
                      {locationSuggestions.map((location: any) => (
                        <Box
                          borderRadius="5px"
                          my={2}
                          boxShadow="sm"
                          border="1px"
                          key={crypto.randomUUID()}
                          _hover={{
                            cursor: 'pointer',
                            backgroundColor: 'teal.500',
                            color: 'white',
                          }}
                        >
                          <button
                            className={`flex flex-col text-left justify-items-start p-3 w-full rounded-xl`}
                            value={location}
                            onClick={() => {
                              setFormValues((prevState) => ({
                                ...prevState,
                                location,
                              }));
                              setLocationSuggestions([]);
                            }}
                          >
                            <span>{location}</span>
                          </button>
                        </Box>
                      ))}
                    </Box>
                  </Fade>
                )}
              </Box>
            </Flex>
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mt={5} isRequired>
                <FormLabel>Event Capacity</FormLabel>
                <Input type="number" name="capacity" value={formValues.capacity} disabled={appLoading} onChange={handleInputChange} />
              </FormControl>
            </Flex>
          </Box>
        </Box>
        <Divider my={10} />
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Sales Campaign</span>
            <span className="mt-2 text-sm w-10/12">This information will be used to specify tickets sale start and end dates.</span>
          </Box>
          <Box className="w-10/12 p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
                <FormLabel>Sale start time</FormLabel>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={formatDate(formValues.startTime && formValues.startTime.length ? new Date(formValues.startTime) : new Date())}
                  onChange={handleInputChange}
                  disabled={appLoading}
                  min={formatDate(new Date())} // set min to current date
                />
              </FormControl>
              <FormControl mr="5%" ml={{ base: '0', md: '5' }} isRequired>
                <FormLabel>Sale end time</FormLabel>
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
          </Box>
        </Box>
        <Flex my={10} className="w-full flex" justifyContent="end">
          <Button colorScheme="red" mr="2%" className="sm:w-24 w-6/12" color={useColorModeValue('white', 'gray.100')} disabled={appLoading} onClick={resetForm}>
            Reset
          </Button>
          <Button
            colorScheme="blue"
            className="sm:w-24 w-6/12"
            _hover={{
              bg: useColorModeValue('green.400', 'green.500'),
            }}
            color={useColorModeValue('white', 'gray.100')}
            bg={useColorModeValue('green.500', 'green.600')}
            disabled={appLoading}
            onClick={doCreateEvent}
          >
            Save
          </Button>
        </Flex>
      </Box>
      {/*
       */}
      {/* <Flex>
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
      </Flex> */}
    </Box>
  );
}
