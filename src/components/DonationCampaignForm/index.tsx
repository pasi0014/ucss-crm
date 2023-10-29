import React, { Suspense, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import imageCompression from 'browser-image-compression';

import { AppContext } from '../../context/AppContext';

import {
  Button,
  Divider,
  Input,
  FormLabel,
  FormControl,
  Flex,
  useColorModeValue,
  Heading,
  Box
} from '@chakra-ui/react';

import MessageBar, { IMessageBar } from '../MessageBar';
import { DonationCampaign } from '../../data/types/DonationCampaign';
import { getDonationCampaignById } from './calls';
import { Spinner } from '@chakra-ui/react';

const RichTextEditor = React.lazy(() => import('../RichTextEditor'));

interface IDonationCampaignForm {
  onNext: () => void;
  donationCampaign?: DonationCampaign;
  campaignId?: number | undefined;
}

const DonationCampaignForm: React.FC<IDonationCampaignForm> = ({
  onNext,
  donationCampaign,
  campaignId
}) => {
  const { appLoading, setAppLoading } = useContext<any>(AppContext);
  const [formValues, setFormValues] = useState<DonationCampaign>({
    nameEn: '',
    contentEn: '',
    startDate: '',
    endDate: '',
    imageURL: null
  });
  const [error, setError] = useState(false);
  const [minEndDate, setMinEndDate] = useState('');

  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const borderColor = useColorModeValue('border-gray-300', 'border-gray-500');
  const resultBg = useColorModeValue('white', 'gray.500');

  const doFetchEvent = async () => {
    setAppLoading(true);
    setError(false);
    try {
      const response = await getDonationCampaignById(campaignId);
      if (!response.success) {
        setError(true);
        setMessageBar({ type: 'error', message: response.data });
        throw new Error(response.data);
      }

      updateDonationCampaign(response.data);
    } catch (error: any) {
      console.error('Error : ', { ...error });
    }
    setAppLoading(false);
  };

  const updateDonationCampaign = (donationCampaign: DonationCampaign) => {
    setFormValues(prevState => ({
      ...prevState,
      ...donationCampaign
    }));
  };

  const resetForm = () => {
    setFormValues({
      nameEn: '',
      contentEn: '',
      startDate: '',
      endDate: ''
    });
    setError(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDescriptionChange = (val: any) => {
    setFormValues(prevState => ({
      ...prevState,
      description: val
    }));
  };

  const handleImageChange = async (e: any) => {
    const selectedImage = e.target.files[0];
    // Check if a file was selected
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    const compressedFile = await imageCompression(selectedImage, options);
    if (compressedFile) {
      // Display a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setFormValues((prevState: DonationCampaign) => ({
          ...prevState,
          imageURL: reader.result
        }));
      };
      reader.readAsDataURL(compressedFile);
    } else {
      setFormValues(prevState => ({
        ...prevState,
        imageURL: null
      }));
    }
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
    if (
      formValues.startDate &&
      formValues.startDate.length &&
      !formValues.endDate &&
      formValues.endDate.length
    ) {
      const tempDate = formatDate(new Date(formValues.startDate));
      setFormValues(prevState => ({
        ...prevState,
        endTime: tempDate
      }));
      setMinEndDate(tempDate);
    }
  }, [formValues.startDate]);

  /**
   * Cleanup form on unmount event
   */
  useEffect(() => {
    if (campaignId) {
      doFetchEvent();
    }
    return () => resetForm();
  }, []);

  return (
    <Box>
      <Box mt="15px">
        <Heading as="h3" size="lg" my={5} mx={{ base: '15px', sm: '5px' }}>
          Fill in Donation Campaign information
        </Heading>
      </Box>

      {error && messageBar && (
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
            <span className="text-md font-bold w-full">Campaign Information</span>
            <span className="mt-2 text-sm w-10/12">
              This information will be used to be displayed on the website.
            </span>
          </Box>
          <Box className="sm:w-10/12 w-full p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
                <FormLabel>Donation Campaign Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formValues.nameEn}
                  disabled={appLoading}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Flex>
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" mt={5}>
              <FormControl mr="5%" isRequired>
                <FormLabel>Campaign Description</FormLabel>
                <Suspense fallback={<Spinner size="xs" />}>
                  <RichTextEditor
                    initialContent={formValues.contentEn}
                    onSave={handleDescriptionChange}
                  />
                </Suspense>
              </FormControl>
            </Flex>
          </Box>
        </Box>
        {/* DIVIDER */}
        <Divider my={10} />
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Campaign Image</span>
            <span className="mt-2 text-sm w-10/12">
              Upload an image, it will be used as a donation campaign promotion image.
            </span>
          </Box>
          <Box className="sm:w-10/12 w-full p-3">
            <Flex direction={{ base: 'column' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
                <Input type="file" accept="image/*" onChange={handleImageChange} p={1} />
              </FormControl>
              <Box my={5}>
                {formValues.imageURL && (
                  <img src={formValues.imageURL} alt="Preview" style={{ maxWidth: '100px' }} />
                )}
              </Box>
            </Flex>
          </Box>
        </Box>
        <Divider my={10} />
        {/* Date and location */}
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Donation Campaign duration</span>
            <span className="mt-2 text-sm w-10/12">
              Please, select campaign start and end dates.
            </span>
          </Box>
          <Box className="md:w-10/12 w-full  p-3">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              className="md:space-y-0 space-y-5"
            >
              <FormControl mr="5%" isRequired>
                <FormLabel>Start time</FormLabel>
                <Input
                  type="date"
                  name="startTime"
                  value={formatDate(
                    formValues.startDate && formValues.startDate.length
                      ? new Date(formValues.startDate)
                      : new Date()
                  )}
                  onChange={handleInputChange}
                  disabled={appLoading}
                  min={formatDate(new Date())} // set min to current date
                />
              </FormControl>
              <FormControl mr="5%" ml={{ base: '0', md: '5' }} isRequired>
                <FormLabel>End time</FormLabel>
                <Input
                  type="date"
                  name="endTime"
                  value={formatDate(new Date(formValues.endDate))}
                  disabled={appLoading}
                  onChange={handleInputChange}
                  min={minEndDate} // set min to current date
                />
              </FormControl>
            </Flex>
          </Box>
        </Box>
        <Flex
          my={10}
          className="w-full md:space-x-3 space-x-0 md:space-y-0 space-y-3 md:p-0 p-5"
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'center', md: 'end' }}
        >
          <Button
            colorScheme="red"
            mr="2%"
            className="md:w-24 w-full"
            color={useColorModeValue('white', 'gray.100')}
            disabled={appLoading}
            onClick={resetForm}
          >
            Reset
          </Button>
          <Button
            colorScheme="blue"
            className="md:w-24 w-full"
            _hover={{
              bg: useColorModeValue('green.400', 'green.500')
            }}
            color={useColorModeValue('white', 'gray.100')}
            bg={useColorModeValue('green.500', 'green.600')}
            disabled={appLoading}
            onClick={() => console.log({ formValues })}
          >
            Save
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default DonationCampaignForm;
